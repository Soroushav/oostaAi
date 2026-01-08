import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Lock, 
  CreditCard, 
  LogOut, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

// --- Tab Components (defined below for cleanliness) ---
// 1. Profile Tab
const ProfileTab = () => (
  <div className="space-y-6 animate-card-enter">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold">
        A
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">علی محمدی</h3>
        <p className="text-slate-500 text-sm">عضویت از: ۱۴۰۲/۱۰/۰۱</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
        <input type="text" defaultValue="علی محمدی" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">شماره موبایل</label>
        <input type="tel" defaultValue="09123456789" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-slate-700">آدرس ایمیل</label>
        <input type="email" defaultValue="ali.mohammadi@example.com" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all" />
      </div>
    </div>

    <div className="pt-4 flex justify-end">
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-200">
        ذخیره تغییرات
      </button>
    </div>
  </div>
);

// 2. Subscriptions Tab
const SubscriptionsTab = () => (
  <div className="space-y-6 animate-card-enter">
    <h3 className="text-lg font-bold text-slate-900 mb-6">اشتراک‌های فعال من</h3>
    
    {/* Active Card */}
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <CreditCard className="text-white" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">ChatGPT Plus</h4>
            <span className="text-emerald-100 text-xs">پلن شخصی - ۱ ماهه</span>
          </div>
        </div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          فعال
        </span>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="text-emerald-100 text-xs">
          <p className="mb-1 opacity-80">تاریخ انقضا</p>
          <p className="font-bold text-white text-base">۱۴۰۳/۰۲/۱۵</p>
        </div>
        <button className="bg-white text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
          تمدید اشتراک
        </button>
      </div>
    </div>

    {/* Expired Card (Example) */}
    <div className="border border-slate-200 bg-slate-50 rounded-2xl p-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-slate-200 p-2 rounded-lg">
            <CreditCard className="text-slate-500" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-700">Midjourney Standard</h4>
            <span className="text-slate-400 text-xs">منقضی شده</span>
          </div>
        </div>
        <span className="text-slate-400 text-xs font-bold bg-slate-200 px-3 py-1 rounded-full">
          غیرفعال
        </span>
      </div>
    </div>
  </div>
);

// 3. Orders Tab
const OrdersTab = () => (
  <div className="space-y-6 animate-card-enter">
    <h3 className="text-lg font-bold text-slate-900 mb-6">تاریخچه سفارشات</h3>
    
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="text-slate-500 font-medium border-b border-slate-100">
          <tr>
            <th className="pb-4 pr-4">شماره سفارش</th>
            <th className="pb-4">محصول</th>
            <th className="pb-4">مبلغ (تومان)</th>
            <th className="pb-4">تاریخ</th>
            <th className="pb-4 pl-4">وضعیت</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <td className="py-4 pr-4 font-mono text-slate-400">#ORD-2391</td>
            <td className="py-4 font-bold">ChatGPT Plus</td>
            <td className="py-4">۱,۲۵۰,۰۰۰</td>
            <td className="py-4">۱۴۰۳/۰۱/۱۵</td>
            <td className="py-4 pl-4">
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full text-xs font-bold">
                <CheckCircle2 size={14} /> موفق
              </span>
            </td>
          </tr>
          <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <td className="py-4 pr-4 font-mono text-slate-400">#ORD-2100</td>
            <td className="py-4 font-bold">Midjourney Basic</td>
            <td className="py-4">۶۵۰,۰۰۰</td>
            <td className="py-4">۱۴۰۲/۱۲/۱۰</td>
            <td className="py-4 pl-4">
              <span className="flex items-center gap-1.5 text-red-600 bg-red-50 w-fit px-2.5 py-1 rounded-full text-xs font-bold">
                <XCircle size={14} /> ناموفق
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// 4. Security Tab
const SecurityTab = () => (
  <div className="space-y-6 animate-card-enter">
    <h3 className="text-lg font-bold text-slate-900 mb-6">تغییر رمز عبور</h3>
    
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">رمز عبور فعلی</label>
        <div className="relative">
          <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">رمز عبور جدید</label>
        <div className="relative">
          <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">تکرار رمز عبور جدید</label>
        <div className="relative">
          <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>
    </div>

    <div className="pt-4">
      <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-slate-200">
        بروزرسانی رمز عبور
      </button>
    </div>
  </div>
);


// --- MAIN COMPONENT ---
const UserPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Menu Configuration
  const menuItems = [
    { id: 'profile', label: 'پروفایل کاربری', icon: User },
    { id: 'subscriptions', label: 'اشتراک‌های فعال', icon: CreditCard },
    { id: 'orders', label: 'سفارش‌های قبلی', icon: ShoppingBag },
    { id: 'security', label: 'امنیت و رمز عبور', icon: Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'subscriptions': return <SubscriptionsTab />;
      case 'orders': return <OrdersTab />;
      case 'security': return <SecurityTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden" dir="rtl">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-enter {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">حساب کاربری</h1>
          <p className="text-slate-500">مدیریت اشتراک‌ها و تنظیمات حساب</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR (Right Side) --- */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-4 sticky top-24">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <item.icon size={20} className={activeTab === item.id ? 'text-emerald-500' : 'text-slate-400'} />
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronLeft size={16} className="mr-auto text-emerald-400" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="my-4 border-t border-slate-100 mx-2"></div>

              <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={20} />
                خروج از حساب
              </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT (Left Side) --- */}
          <main className="flex-1">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px]">
              {renderContent()}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default UserPanel;