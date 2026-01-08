import React, { useState } from 'react';
import { Search, Bot, Sparkles, Zap, Palette, Music, Clapperboard, Brain, Image as ImageIcon } from 'lucide-react';
import ProductCard, { type ProductCardProps } from './ProductCard';

// 1. Define Data
const allProducts: ProductCardProps[] = [
  {
    title: 'ChatGPT Plus',
    englishTitle: 'OpenAI',
    category: 'هوش مصنوعی',
    description: 'قدرتمندترین مدل زبانی برای مکالمه و تولید محتوا حرفه‌ای با سرعت خیره‌کننده',
    price: '۱,۲۵۰,۰۰۰',
    colorClass: 'bg-emerald-500', 
    icon: Bot,
  },
  {
    title: 'Gemini Advanced',
    englishTitle: 'Google',
    category: 'هوش مصنوعی',
    description: 'هوش مصنوعی پیشرفته گوگل با قابلیت‌های چندرسانه‌ای و درک عمیق تصاویر',
    price: '۱,۱۰۰,۰۰۰',
    colorClass: 'bg-violet-500', 
    icon: Sparkles,
  },
  {
    title: 'Grok Premium',
    englishTitle: 'xAI',
    category: 'هوش مصنوعی',
    description: 'هوش مصنوعی ایلان ماسک با دسترسی به اطلاعات لحظه‌ای و طنز منحصر به فرد',
    price: '۹۵۰,۰۰۰',
    colorClass: 'bg-slate-800', 
    icon: Zap,
  },
  {
    title: 'Canva Pro',
    englishTitle: 'Digital Design',
    category: 'طراحی',
    description: 'طراحی حرفه‌ای با ابزارهای جادویی هوش مصنوعی و آرشیو میلیونی تصاویر',
    price: '۲۹۰,۰۰۰',
    colorClass: 'bg-blue-500', 
    icon: Palette,
  },
  {
    title: 'Midjourney',
    englishTitle: 'AI Art',
    category: 'هنری',
    description: 'خلق شاهکارهای هنری با کلمات در با بالاترین کیفیت تولید تصویر جهان',
    price: '۱,۸۰۰,۰۰۰',
    colorClass: 'bg-rose-500', 
    icon: ImageIcon,
  },
  {
    title: 'Claude 3 Opus',
    englishTitle: 'Anthropic',
    category: 'هوش مصنوعی',
    description: 'هوشمندترین مدل آنتروپیک برای استدلال‌های منطقی و کارهای کدنویسی سنگین',
    price: '۱,۴۵۰,۰۰۰',
    colorClass: 'bg-amber-600', 
    icon: Brain,
  },
  {
    title: 'Netflix Premium 4K',
    englishTitle: 'Entertainment',
    category: 'سرگرمی',
    description: 'تماشای فیلم و سریال‌های روز دنیا با بالاترین کیفیت ممکن و صدای دالبی',
    price: '۳۷۰,۰۰۰',
    colorClass: 'bg-red-600', 
    icon: Clapperboard,
  },
  {
    title: 'Spotify Individual',
    englishTitle: 'Music',
    category: 'سرگرمی',
    description: 'دنیای موسیقی بدون تبلیغات و با بالاترین کیفیت صدا در تمامی دستگاه‌ها',
    price: '۱۸۰,۰۰۰',
    colorClass: 'bg-green-600', 
    icon: Music,
  },
];

const categories = ['همه', 'هوش مصنوعی', 'طراحی', 'هنری', 'سرگرمی'];

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Filter Logic
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === 'همه' || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.englishTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative z-10 w-full py-16 bg-slate-50 min-h-screen" dir="rtl">
      
      {/* Custom Keyframe Animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-enter {
          opacity: 0; /* Start hidden */
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Toolbar Section --- */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 placeholder-slate-400 text-sm font-medium rounded-2xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-100 border border-transparent focus:border-emerald-200 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>

        </div>

        {/* --- Product Grid --- */}
        {filteredProducts.length > 0 ? (
          // The 'key' here forces the Grid to re-mount when filters change, triggering the animation
          <div 
            key={activeCategory + searchQuery} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              // Wrapper div handles the animation and delay
              <div 
                key={product.title} 
                className="animate-card-enter h-full"
                style={{ animationDelay: `${index * 100}ms` }} // Stagger effect
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 animate-card-enter">
            <p className="text-slate-400 font-medium">محصولی با این مشخصات یافت نشد.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Products;