import React from 'react';
import { Category, Language } from '../types';
import { Flame, Pizza, Soup, Salad, Coffee, Cake, Utensils, Grid } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  lang: Language;
  getCategoryCount: (catId: string) => number;
}

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />,
  Pizza: <Pizza className="w-3.5 h-3.5" />,
  Soup: <Soup className="w-3.5 h-3.5" />,
  Salad: <Salad className="w-3.5 h-3.5" />,
  Coffee: <Coffee className="w-3.5 h-3.5" />,
  Cake: <Cake className="w-3.5 h-3.5" />,
};

export const CategoryNav: React.FC<CategoryNavProps> = React.memo(({
  categories,
  activeCategoryId,
  onSelectCategory,
  lang,
  getCategoryCount,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="bg-white border-b border-slate-200 py-2.5 px-4 shadow-2xs">
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const count = getCategoryCount(cat.id);
          const icon = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : <Grid className="w-3.5 h-3.5" />;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer select-none active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20 scale-102'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{icon}</span>
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
CategoryNav.displayName = 'CategoryNav';

