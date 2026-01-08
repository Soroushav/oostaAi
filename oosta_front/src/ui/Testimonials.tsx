import React from 'react';
import { User } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  comment: string;
}

// Data matching the screenshot
const testimonialsData: Testimonial[] = [
  {
    name: 'علی محمدی',
    role: 'توسعه‌دهنده نرم‌افزار',
    comment: '"از وقتی که اشتراک ChatGPT Plus رو از اوستا ای‌آی گرفتم، سرعت کارم چند برابر شده. پشتیبانی عالی و تحویل فوری!"'
  },
  {
    name: 'سارا احمدی',
    role: 'طراح گرافیک',
    comment: '"واقعاً Canva Pro کارم رو متحول کرد. ممنون از اوستا ای‌آی بابت قیمت مناسب و فرآیند خرید آسان."'
  },
  {
    name: 'محمد حسینی',
    role: 'دانشجوی ارشد',
    comment: '"برای تحقیقاتم از Gemini Pro استفاده می‌کنم. کیفیت خدمات اوستا ای‌آی واقعاً عالیه."'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="w-full py-24 bg-slate-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 text-sm font-bold mb-4">
            نظرات مشتریان
          </span>
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            مشتریان ما چه می‌گویند؟
          </h2>
          {/* Subtitle */}
          <p className="text-slate-500 text-lg font-medium">
            بیش از ۵۰۰۰ کاربر راضی
          </p>
        </div>

        {/* --- Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item, index) => (
            <div 
              key={index}
              className="group bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[280px]"
            >
              
              {/* Quote Content */}
              <p className="text-slate-600 text-base md:text-lg leading-loose font-medium mb-8">
                {item.comment}
              </p>

              {/* User Profile Section */}
              {/* Flex container: In RTL, the first child (Text) is on the Right, second (Avatar) is on the Left. 
                  This matches the visual layout in your screenshot. */}
              <div className="flex items-center gap-4">
                
                {/* 1. Name and Role (Right Side visually) */}
                <div className="flex flex-col items-end">
                  <span className="font-bold text-slate-900 text-sm md:text-base">
                    {item.name}
                  </span>
                  <span className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
                    {item.role}
                  </span>
                </div>

                {/* 2. Avatar Placeholder (Left Side visually) */}
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-500 transition-colors duration-300">
                  <User size={24} />
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;