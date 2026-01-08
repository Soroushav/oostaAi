import React from 'react';
import { Mail, Lock, User, ArrowLeft, Bot, Chrome } from 'lucide-react';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans" dir="rtl">
      
      {/* --- Background Ambient Glows (Consistent with Hero) --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
      </div>

      {/* --- Main Card --- */}
      <div className="relative z-10 w-full max-w-[420px] px-4">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ساخت حساب کاربری
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            به جمع ۵۰۰۰+ کاربر اوستا AI بپیوندید
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <form className="space-y-4">
            
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 mr-1">نام و نام خانوادگی</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="مثال: علی محمدی"
                  className="w-full bg-slate-50 text-slate-800 text-sm font-medium rounded-2xl py-3.5 pr-12 pl-4 outline-none border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 mr-1">آدرس ایمیل</label>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 text-slate-800 text-sm font-medium rounded-2xl py-3.5 pr-12 pl-4 outline-none border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 mr-1">رمز عبور</label>
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-800 text-sm font-medium rounded-2xl py-3.5 pr-12 pl-4 outline-none border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-3.5 mt-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2">
              ثبت‌نام رایگان
              <ArrowLeft size={18} />
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">یا ثبت‌نام با</span>
            </div>
          </div>

          {/* Google Button */}
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl py-3.5 border border-slate-200 transition-all flex items-center justify-center gap-2.5">
            <Chrome size={20} className="text-slate-500" />
            <span>حساب گوگل</span>
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
              وارد شوید
            </a>
          </p>

        </div>
        
        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          با ثبت‌نام، شما <a href="#" className="underline hover:text-slate-600">قوانین و مقررات</a> اوستا AI را می‌پذیرید.
        </p>

      </div>
    </div>
  );
};

export default Signup;