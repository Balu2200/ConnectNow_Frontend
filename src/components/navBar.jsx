import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for floating nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-200/20"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "py-3" : "py-4"
            }`}
          >
            {/* Logo */}
            <Link to="/feed" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                CodeCircle
              </span>
            </Link>

            {user && (
              <div className="flex items-center space-x-6">
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center">
                  <div className="flex items-center bg-slate-50/80 backdrop-blur-sm rounded-2xl p-1.5 space-x-1">
                    {[
                      {
                        path: "/feed",
                        label: "Discover",
                        icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                      },
                      {
                        path: "/profile",
                        label: "Profile",
                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                      },
                      {
                        path: "/connections",
                        label: "Network",
                        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                      },
                      {
                        path: "/requestreceived",
                        label: "Requests",
                        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
                      },
                    ].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                          isActiveRoute(item.path)
                            ? "bg-white text-primary shadow-md shadow-slate-200/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={item.icon}
                          ></path>
                        </svg>
                        <span>{item.label}</span>
                        {isActiveRoute(item.path) && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-xl shadow-md shadow-slate-200/50"
                            style={{ zIndex: -1 }}
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* User Profile Section */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-slate-50/80 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {user.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-sm font-medium text-slate-900">
                        {user.firstName}
                      </span>
                      <p className="text-xs text-slate-500">Online</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border border-slate-200/50 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      <span>Logout</span>
                    </div>
                  </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl bg-slate-50/80 backdrop-blur-sm border border-slate-200/50"
                >
                  <svg
                    className="w-5 h-5 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    )}
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {[
                    {
                      path: "/feed",
                      label: "Discover",
                      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                    },
                    {
                      path: "/profile",
                      label: "Profile",
                      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                    },
                    {
                      path: "/connections",
                      label: "Network",
                      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                    },
                    {
                      path: "/requestreceived",
                      label: "Requests",
                      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActiveRoute(item.path)
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={item.icon}
                        ></path>
                      </svg>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile User Info & Logout */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.firstName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.firstName}
                        </p>
                        <p className="text-sm text-slate-500">Online</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind floating nav */}
      <div className="h-20"></div>
    </>
  );
}

export default Navbar;
