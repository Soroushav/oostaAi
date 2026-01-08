import React from 'react'
import { Mail, Lock, ArrowLeft, Chrome } from 'lucide-react';

export default function LoginForm() {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <form className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 mr-1">ایمیل</label>
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
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700">رمز عبور</label>
                
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-800 text-sm font-medium rounded-2xl py-3.5 pr-12 pl-4 outline-none border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
              <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                  رمز عبور را فراموش کرده‌اید؟
                </a>
            </div>

            {/* Login Button */}
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-3.5 mt-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2">
              ورود به حساب
              <ArrowLeft size={18} />
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">یا ورود با</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl py-3.5 border border-slate-200 transition-all flex items-center justify-center gap-2.5">
            <Chrome size={20} className="text-slate-500" />
            <span>حساب گوگل</span>
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            حساب کاربری ندارید؟{' '}
            <a href="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
              ثبت‌نام کنید
            </a>
          </p>

    </div>
  )
}
