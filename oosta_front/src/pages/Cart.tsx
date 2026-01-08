import React, { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus, 
  Ticket, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  Bot,
  Music,
  ShoppingBag
} from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  icon: React.ElementType;
  colorClass: string; // Background color for the icon container
}

const Cart: React.FC = () => {
  // Sample Data State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'ChatGPT Plus',
      subtitle: 'اشتراک ۱ ماهه - شخصی',
      price: 1250000,
      icon: Bot,
      colorClass: 'bg-emerald-500',
    },
    {
      id: '2',
      title: 'Spotify Premium',
      subtitle: 'اشتراک ۳ ماهه - Individual',
      price: 180000,
      icon: Music,
      colorClass: 'bg-green-600',
    }
  ]);

  const [discountCode, setDiscountCode] = useState('');

  // Calculate Total
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = 0; // Or calculate tax if needed
  const total = subtotal + tax;

  // Remove Handler
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Number Formatter
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden" dir="rtl">
      
      {/* --- Background Ambient Glows --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-sm border border-slate-100">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">سبد خرید</h1>
            <p className="text-slate-500 text-sm mt-1">
              {cartItems.length} محصول در سبد شما وجود دارد
            </p>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- Left Column: Cart Items List --- */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-[24px] p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
                >
                  {/* Product Icon */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 ${item.colorClass} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 shrink-0`}>
                    <item.icon size={32} />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-right w-full">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{item.subtitle}</p>
                    
                    {/* Price (Mobile Only) */}
                    <div className="sm:hidden font-black text-slate-800 text-lg mb-4">
                      {formatPrice(item.price)} <span className="text-xs font-medium text-slate-400">تومان</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      {/* Quantity (Static for subscriptions usually) */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-2 py-1.5 border border-slate-200">
                        <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors" disabled>
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-slate-700 w-4 text-center">1</span>
                        <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors" disabled>
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-bold bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </div>

                  {/* Price (Desktop Only) */}
                  <div className="hidden sm:block text-left pl-2">
                    <span className="block text-xl font-black text-slate-900 tracking-tight">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">تومان</span>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Right Column: Summary Card --- */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                
                <h3 className="font-bold text-slate-900 text-lg mb-6">خلاصه سفارش</h3>

                {/* Costs */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>مجموع اقلام</span>
                    <span className="font-bold">{formatPrice(subtotal)} تومان</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 text-sm">
                    <span>سود شما از خرید</span>
                    <span className="font-bold">۰ تومان</span>
                  </div>
                  <div className="w-full h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">مبلغ قابل پرداخت</span>
                    <div className="text-left">
                      <span className="block text-xl font-black text-slate-900">{formatPrice(total)}</span>
                      <span className="text-xs text-slate-400">تومان</span>
                    </div>
                  </div>
                </div>

                {/* Discount Input */}
                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-500 mb-2 block mr-1">کد تخفیف دارید؟</label>
                  <div className="relative flex items-center">
                    <div className="absolute right-4 text-slate-400">
                      <Ticket size={20} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="کد تخفیف"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full bg-slate-50 text-sm font-bold text-slate-800 rounded-2xl py-3.5 pr-12 pl-24 outline-none border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100 transition-all placeholder:font-medium placeholder:text-slate-400"
                    />
                    <button className="absolute left-2 top-2 bottom-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold px-4 rounded-xl transition-colors">
                      ثبت
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl py-4 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3">
                  تکمیل خرید
                  <ArrowRight size={20} />
                </button>

                {/* Trust Indicators */}
                <div className="mt-6 flex justify-center gap-6 text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={20} />
                    <span className="text-[10px]">پرداخت امن</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CreditCard size={20} />
                    <span className="text-[10px]">عضو شتاب</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">سبد خرید شما خالی است</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
              شما هنوز هیچ محصولی را به سبد خرید خود اضافه نکرده‌اید.
            </p>
            <a 
              href="/products" 
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200"
            >
              مشاهده محصولات
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;