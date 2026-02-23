import React from "react";
import { User, LogOutIcon, Bot, LogIn } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../services/apiAuth";

const Header: React.FC = () => {
  const {isAuthenticated} = useAuth();
  const { logout : logoutContext} = useAuth();

  const handleLogout = async () => {
    try{
      await logoutApi();
      navigate("/main", { replace: true })
      setTimeout(() => {
        logoutContext();
      }, 1)
    } catch(error){
      console.log("Logout API failed", error)
    }
  }
  const navigate = useNavigate()
  const navLinks = [
    { id: "main", label: "صفحه اصلی", href: "/main" },
    { id: "products", label: "محصولات", href: "/products" },
    { id: "blog", label: "وبلاگ", href: "/blog" },      // give real routes (not #)
    { id: "support", label: "پشتیبانی", href: "/support" },
  ];

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Right Section: Logo */}
          <div className="flex-1 flex justify-start items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Bot size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                اوستا <span className="text-emerald-600">AI</span>
              </span>
              <span className="text-xs text-slate-500">هوش مصنوعی برای همه</span>
            </div>
          </div>

          {/* Center Section: Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Left Section: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {isAuthenticated && <button
              className="hidden sm:flex p-2.5 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              title="Logout"
              onClick={handleLogout}
            >
              <LogOutIcon size={20} />
            </button>
            }

            
            {
              isAuthenticated ? (
                <button
                  onClick={() => navigate("/panel")}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-slate-200 cursor-pointer"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">حساب کاربری</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-200 cursor-pointer"
                >
                  <LogIn size={18} />
                  <span className="text-sm font-medium">ورود به حساب</span>
                </button>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;