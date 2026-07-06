import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { loginAdmin } from "../../api/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear login error when user types
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setLoginError("");
    try {
      await loginAdmin(formData);

      toast.success("Login successful! Redirecting to dashboard...");
      navigate('/admin');
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.status
        ? error.message
        : "Unable to connect to server. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 sm:py-4 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 transition text-sm sm:text-base";
  const labelClasses = "block text-xs sm:text-sm font-medium text-[#2F6B3C] mb-1.5 sm:mb-2";

  return (
    <div className="min-h-screen bg-[#F6F4ED] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[90%] sm:max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#2F6B3C] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif text-2xl">RA</span>
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#222] mb-2">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#666]">
            Sign in to manage your listings
          </p>
        </div>
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600">{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10 ${
                      errors.email ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                    placeholder="admin@royalrealty.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
                )}
              </div>
              {/* Password Field */}
              <div>
                <label htmlFor="password" className={labelClasses}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClasses} pl-10 pr-12 ${
                      errors.password ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#2F6B3C] transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
                )}
              </div>
              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => toast.error("Please contact your administrator")}
                  className="text-xs text-[#666] hover:text-[#2F6B3C] transition"
                >
                  Forgot password?
                </button>
              </div>
              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full px-6 py-3 sm:py-4 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8 text-center space-y-2"
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#666] hover:text-[#2F6B3C] transition"
          >
            Return to Website
            <ArrowRight size={14} />
          </Link>
          
          <p className="text-xs text-[#999]">
            © {new Date().getFullYear()} Royal Realty. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}