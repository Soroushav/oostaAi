import React from 'react';
import { Bot, Instagram, Send, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Top Section: Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Description (Span 4 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                {/* Placeholder Logo Icon */}
                <Bot size={28} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                اوستا <span className="text-emerald-500">AI</span>
              </span>
            </div>
            
            {/* Description */}
            <p className="text-slate-500 leading-loose mb-8 max-w-sm">
              دسترسی آسان و مقرون‌به‌صرفه به ابزارهای هوش مصنوعی برای کاربران ایرانی. ما اینجاییم تا شما را به آینده متصل کنیم.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
                <Send size={20} className="-ml-0.5 mt-0.5" /> {/* Telegram adjustment */}
              </a>
              <a href="#" className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Access (Span 2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 text-lg mb-6">دسترسی سریع</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">صفحه اصلی</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">محصولات</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">مقالات</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">تماس با ما</a></li>
            </ul>
          </div>

          {/* Column 3: Products (Span 2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 text-lg mb-6">محصولات</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">ChatGPT Plus</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">Gemini Pro</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">Grok Premium</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">Canva Pro</a></li>
            </ul>
          </div>

          {/* Column 4: Support (Span 3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-slate-900 text-lg mb-6">پشتیبانی</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">راهنمای خرید</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">ارسال تیکت</a></li>
              <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors">قوانین و مقررات</a></li>
            </ul>
          </div>

        </div>

        {/* --- Divider --- */}
        <div className="w-full h-px bg-slate-100 my-8"></div>

        {/* --- Bottom Section: Copyright --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          
          {/* Right Side: Copyright Text */}
          <div className="flex items-center gap-1">
            <span>© ۲۰۲۶ اوستا ای‌آی</span>
            <span className="hidden sm:inline">-</span>
            <span className="flex items-center gap-1">
              ساخته شده با 
              <Heart size={14} className="text-red-500 fill-red-500" /> 
              در مسینا
            </span>
          </div>

          {/* Left Side: Policy Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">حریم خصوصی</a>
            <a href="#" className="hover:text-slate-900 transition-colors">شرایط استفاده</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;