import React from 'react';
import { Bot } from 'lucide-react';
import LoginForm from '../features/authentication/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans" dir="rtl">
      
      {/* --- Background Ambient Glows --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
      </div>

      {/* --- Main Content Wrapper --- */}
      <div className="relative z-10 w-full max-w-[420px] px-4">
        
        {/* Header / Logo Section */}
        {/* Changed 'mb-8' to 'mb-6' to reduce space to the card */}
        <div className="flex flex-col items-center mb-1">
          {/* Changed 'mb-4' to 'mb-3' to tighten logo space */}
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            خوش‌آمدید!
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            وارد حساب کاربری خود شوید
          </p>
        </div>

        {/* Login Card */}
        <LoginForm />

      </div>
    </div>
  );
};

export default Login;