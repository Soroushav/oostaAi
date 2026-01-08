import React, { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'اوستا ای‌آی چیست؟',
    answer: 'اوستا ای‌آی یک پلتفرم فروش اشتراک ابزارهای هوش مصنوعی برای کاربران ایرانی است. ما دسترسی آسان و مقرون‌به‌صرفه به ابزارهایی مانند ChatGPT, Gemini, Grok و Canva را فراهم می‌کنیم.'
  },
  {
    question: 'چگونه سفارش دهم؟',
    answer: 'شما می‌توانید با انتخاب محصول مورد نظر و افزودن آن به سبد خرید، فرآیند پرداخت را انجام دهید. سفارش شما بلافاصله پس از پرداخت پردازش می‌شود.'
  },
  {
    question: 'تحویل سفارش چقدر طول می‌کشد؟',
    answer: 'اکثر سفارش‌ها به صورت آنی و خودکار انجام می‌شوند. در موارد خاص، ممکن است تا ۳۰ دقیقه زمان ببرد.'
  },
  {
    question: 'آیا پشتیبانی دارید؟',
    answer: 'بله، تیم پشتیبانی ما ۲۴ ساعته در ۷ روز هفته از طریق تیکت و چت آنلاین آماده پاسخگویی به سوالات شماست.'
  },
  {
    question: 'روش‌های پرداخت چیست؟',
    answer: 'شما می‌توانید با استفاده از کلیه کارت‌های عضو شبکه شتاب از طریق درگاه پرداخت امن زرین‌پال یا نکست‌پی پرداخت خود را انجام دهید.'
  },
  {
    question: 'آیا امکان استرداد وجود دارد؟',
    answer: 'در صورت عدم عملکرد صحیح اشتراک یا وجود مشکل فنی که توسط پشتیبانی قابل حل نباشد، وجه شما به طور کامل عودت داده می‌شود.'
  }
];

const FAQ: React.FC = () => {
  // State to track which item is currently open (0 is open by default based on screenshot)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-slate-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold mb-4">
            سوالات متداول
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            پاسخ سوالات شما
          </h2>
          <p className="text-slate-500 text-lg">
            اگر سوال دیگری دارید، با پشتیبانی تماس بگیرید
          </p>
        </div>

        {/* --- Accordion List --- */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                onClick={() => toggleFAQ(index)}
                className={`
                  bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer
                  ${isOpen ? 'border-emerald-100 shadow-md ring-1 ring-emerald-100' : 'border-slate-100 shadow-sm hover:shadow-md'}
                `}
              >
                {/* Question Header */}
                <div className="p-6 flex items-center justify-between gap-4">
                  <h3 className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {item.question}
                  </h3>
                  
                  {/* Icon Rotation */}
                  <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} 
                    size={20} 
                  />
                </div>

                {/* Answer Content (Animated Height) */}
                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-transparent">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Bottom CTA --- */}
        <div className="mt-16 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500 font-medium">
            سوال دیگری دارید؟
          </p>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
            <Phone size={18} />
            تماس با پشتیبانی
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQ;