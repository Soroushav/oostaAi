import { 
  Zap, 
  ShieldCheck, 
  Headphones, 
  Users, 
  CheckCircle2, 
  Star, 
  Activity 
} from 'lucide-react';

const HeroSection = () => {
  return (
    <>
      {/* Define custom animation styles just for this component */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card {
          opacity: 0; /* Start hidden */
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>

      <section className="relative w-full py-20 bg-slate-50/50 overflow-hidden flex flex-col items-center">
        


        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          
          {/* --- Top Hero Content (Title & Buttons) --- */}
          <div className="text-center max-w-4xl mx-auto mb-20 animate-card">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              فراتر از{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-blue-600">
                یک اشتراک
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              دنیای هوش مصنوعی را با اوستا AI تجربه کنید. تحویل فوری، پشتیبانی دائمی.
            </p>
            <div className="flex flex-col sm:flex-row-reverse items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-200/50 hover:-translate-y-1">
                مشاهده فروشگاه
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60 rounded-2xl font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                مجله آموزشی
              </button>
            </div>
          </div>

          {/* --- Trust Indicators (Small Dots) --- */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-xs sm:text-sm font-medium text-slate-500 animate-card" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              پرداخت امن
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              تحویل فوری
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              گارانتی بازگشت وجه
            </div>
          </div>

          {/* --- Feature Cards (Row of 3) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1: Instant Delivery */}
            {/* Added 'group' class for hover effects on children */}
            {/* Added 'animate-card' and delay style */}
            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-card" style={{ animationDelay: '0.2s' }}>
              {/* Icon Container: Added transition and group-hover classes */}
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <Zap size={28} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">تحویل فوری</h3>
              <p className="text-slate-500 text-sm">بلافاصله پس از خرید فعال می‌شود</p>
            </div>

            {/* Card 2: Safe Payment */}
            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-card" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">پرداخت امن</h3>
              <p className="text-slate-500 text-sm">درگاه معتبر بانکی با رمزنگاری</p>
            </div>

            {/* Card 3: Support */}
            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-card" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <Headphones size={28} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">پشتیبانی ۲۴/۷</h3>
              <p className="text-slate-500 text-sm">همیشه در کنار شما هستیم</p>
            </div>
          </div>

          {/* --- Statistics Bar (Bottom Wide Card) --- */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-card" style={{ animationDelay: '0.5s' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-x-0 lg:divide-x lg:divide-x-reverse divide-slate-100">
              
              {/* Stat 1 */}
              {/* Added 'group' to container and hover classes to icon container */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                  <Users size={24} />
                </div>
                <span className="text-3xl font-black text-emerald-500 mb-1" dir="ltr">+۵۰۰۰</span>
                <span className="text-sm font-medium text-slate-500">کاربر فعال</span>
              </div>

              {/* Stat 2 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-3xl font-black text-emerald-500 mb-1" dir="ltr">+۱۲۰۰۰</span>
                <span className="text-sm font-medium text-slate-500">سفارش موفق</span>
              </div>

              {/* Stat 3 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                  <Star size={24} />
                </div>
                <span className="text-3xl font-black text-amber-400 mb-1" dir="ltr">۴.۹</span>
                <span className="text-sm font-medium text-slate-500">امتیاز رضایت</span>
              </div>

              {/* Stat 4 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                  <Activity size={24} />
                </div>
                <span className="text-3xl font-black text-blue-500 mb-1" dir="ltr">۹۹٪</span>
                <span className="text-sm font-medium text-slate-500">تحویل موفق</span>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HeroSection;