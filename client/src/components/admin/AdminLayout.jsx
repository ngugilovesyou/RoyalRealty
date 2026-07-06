import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { logoutAdmin,verifyAdminToken } from '../../api/api';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      if (location.pathname === '/admin/auth') {
        setIsLoading(false);
        return;
      }

      const admin = await verifyAdminToken();

      if (admin) {
        setIsAuthenticated(true);
        setAdminUser(admin);
      } else if (admin === null) {
        setIsAuthenticated(false);
        setAdminUser(null);
        navigate('/admin/auth');
      } else {
    
      }

      setIsLoading(false);
    };
    checkAuth();
  }, [location.pathname, navigate]);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate('/admin/auth');
  };

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Listings", href: "/admin/listings", icon: MapPin },
    { name: "Pending Approval", href: "/admin/pending", icon: Clock },
    { name: "Approved", href: "/admin/approved", icon: CheckCircle },
  ];

  const Overlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black z-20 md:hidden"
    />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#2F6B3C] mx-auto mb-4" />
          <p className="text-[#666]">Loading...</p>
        </div>
      </div>
    );
  }

  if (location.pathname === '/admin/auth') {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#2F6B3C] mx-auto mb-4" />
          <p className="text-[#666]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && <Overlay />}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen 
            ? 280 
            : (isMobile ? 0 : 80),
          x: isMobile && !sidebarOpen ? -280 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-white shadow-xl z-30 overflow-hidden"
      >
        <div className="h-full flex flex-col min-w-[280px]">
          {/* Logo */}
          <div className="p-6 border-b border-[#e0e0e0]">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2F6B3C] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif text-xl">R</span>
              </div>
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-serif text-lg text-[#222] whitespace-nowrap"
                  >
                    Royal Realty
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    whileHover={{ x: isMobile ? 0 : 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#2F6B3C] text-white' 
                        : 'text-[#666] hover:bg-[#2F6B3C]/10'
                    } ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}
                    title={!sidebarOpen && !isMobile ? item.name : undefined}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          {/* User Info */}
          {adminUser && (
            <div className="px-4 py-3 border-t border-[#e0e0e0]">
              <div className={`flex items-center gap-3 ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 bg-[#2F6B3C] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {adminUser.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm font-medium text-[#222] truncate">
                        {adminUser.email?.split('@')[0] || 'Admin'}
                      </p>
                      <p className="text-xs text-[#666] truncate">
                        {adminUser.email || 'admin@royalrealty.co.ke'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          {/* Logout */}
          <div className="p-4 border-t border-[#e0e0e0]">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 text-[#666] hover:text-red-500 transition w-full ${
                !sidebarOpen && !isMobile ? 'justify-center' : ''
              }`}
              title={!sidebarOpen && !isMobile ? "Logout" : undefined}
            >
              <LogOut size={20} className="flex-shrink-0" />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
      {/* Main Content */}
      <motion.div
        animate={{ 
          marginLeft: isMobile ? 0 : (sidebarOpen ? 280 : 80)
        }}
        transition={{ duration: 0.3 }}
        className="min-w-0"
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F6F4ED] rounded-lg transition relative z-30"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-[#222]">
                  {adminUser?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-[#666]">royalrealty.co.ke</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2F6B3C] rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#3D8A4F] transition text-sm">
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="p-3 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}