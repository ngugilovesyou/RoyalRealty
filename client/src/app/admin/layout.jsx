"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount and when route changes
  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the login page
      if (pathname === '/admin/auth') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('adminToken');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (token && isAdmin) {
        setIsAuthenticated(true);
        
        // Get admin user data if available
        const userData = localStorage.getItem('adminUser');
        if (userData) {
          try {
            setAdminUser(JSON.parse(userData));
          } catch (e) {
            console.error('Error parsing admin user data:', e);
          }
        }
      } else {
        setIsAuthenticated(false);
        // Only redirect if not already on login page
        if (pathname !== '/admin/auth') {
          router.push('/admin/auth');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Verify token with backend (optional but recommended)
  useEffect(() => {
    const verifyToken = async () => {
      // Skip verification on login page or if not authenticated
      if (pathname === '/admin/auth' || !isAuthenticated) {
        return;
      }

      const token = localStorage.getItem('adminToken');
      
      try {
        const response = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Token invalid
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminUser');
          setIsAuthenticated(false);
          router.push('/admin/auth');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Don't logout on network errors, just log
      }
    };

    verifyToken();
  }, [pathname, isAuthenticated, router]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    
    // Update state
    setIsAuthenticated(false);
    
    // Redirect to login
    router.push('/admin/auth');
  };

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true); // Open by default on desktop
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
  }, [pathname, isMobile]);

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Listings", href: "/admin/listings", icon: MapPin },
    { name: "Pending Approval", href: "/admin/pending", icon: Clock },
    { name: "Approved", href: "/admin/approved", icon: CheckCircle },
  ];

  // Overlay for mobile when sidebar is open
  const Overlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black z-20 md:hidden"
    />
  );

  // Show loading state
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

  // If on login page, render without sidebar
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show loading or nothing
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

  // Authenticated view with sidebar
  return (
    <div className="min-h-screen bg-[#F6F4ED]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && <Overlay />}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: isMobile ? 0 : 80 }}
        animate={{ 
          width: sidebarOpen 
            ? (isMobile ? 280 : 280) 
            : (isMobile ? 0 : 80)
        }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-30 overflow-hidden ${
          isMobile && !sidebarOpen ? 'invisible' : 'visible'
        }`}
      >
        <div className="h-full flex flex-col min-w-[280px]">
          {/* Logo */}
          <div className="p-6 border-b border-[#e0e0e0]">
            <Link href="/admin" className="flex items-center gap-3">
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
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
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
        className="transition-all duration-300"
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F6F4ED] rounded-lg transition relative z-30"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-[#222]">
                  {adminUser?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-[#666]">royalrealty.co.ke</p>
              </div>
              <div className="w-10 h-10 bg-[#2F6B3C] rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#3D8A4F] transition">
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8">
          {children}
        </main>
      </motion.div>
    </div>
  );
}