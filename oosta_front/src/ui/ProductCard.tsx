import React from 'react';
import { Plus } from 'lucide-react';

export interface ProductCardProps {
  title: string;
  englishTitle: string; // Added for the subtitle (e.g., "OpenAI")
  description: string;
  category: string;
  price: string;
  icon: React.ElementType; // Pass the Icon component itself
  colorClass: string; // e.g., 'bg-emerald-500'
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  englishTitle,
  description,
  category,
  price,
  icon: Icon,
  colorClass,
}) => {
  return (
    <div className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
      
      {/* --- Top Section: Colored Header & Icon --- */}
      <div className={`h-40 w-full ${colorClass} flex items-center justify-center p-6 transition-colors duration-300`}>
        <Icon size={48} className="text-white drop-shadow-md" />
      </div>

      {/* --- Middle Section: Content --- */}
      <div className="flex-1 flex flex-col p-6 text-center">
        
        {/* Category Label */}
        <span className="text-xs font-bold text-emerald-600 mb-2 block">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-800 mb-1 font-sans tracking-tight">
          {title}
        </h3>
        
        {/* English Subtitle */}
        <span className="text-xs font-bold text-slate-400 mb-3 dir-ltr">
          {englishTitle}
        </span>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        {/* --- Bottom Section: Price & Action --- */}
        <div className="mt-auto flex items-center justify-between w-full border-t border-slate-50 pt-4">
          
          {/* Action Button (Add) */}
          <button className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-all hover:scale-110 active:scale-95">
            <Plus size={24} />
          </button>

          {/* Price */}
          <div className="flex flex-col items-end">
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {price}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              تومان / ماهانه
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;