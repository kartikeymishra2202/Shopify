import type { CategoryObj } from "../types/product";

interface SideBarFilterProps {
  categories: CategoryObj[];
  selectedCategories: string[];
  onCategoriesToggle: (slug: string) => void;
  sortOrder: "low-high" | "high-low" | null;
  onSortChange: (order: "low-high" | "high-low" | null) => void;
}

const SideBar = ({
  categories,
  selectedCategories,
  onCategoriesToggle,
  sortOrder,
  onSortChange,
}: SideBarFilterProps) => {
  const uniqueCategories = Array.from(
    new Map(categories.map((cat) => [cat.slug, cat])).values()
  );

  return (
    <aside className="w-full h-full flex flex-col">
   
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#5048e5] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="material-symbols-outlined text-white">shopping_bag</span>
          </div>
          <div>
            <h2 className="text-slate-900 font-bold text-lg leading-tight"></h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Store Manager</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
       
        <div className="space-y-4">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Categories</p>
          <div className="space-y-1">
            {uniqueCategories.map((category) => (
              <label key={category.id} className="flex items-center justify-between group px-3 py-2 rounded-lg cursor-pointer hover:bg-white/50 transition-all">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => onCategoriesToggle(category.slug)}
                    className="w-5 h-5 rounded border-slate-300 text-[#5048e5] focus:ring-[#5048e5]/20 accent-[#5048e5]"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors capitalize">
                    {category.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-white/20 mx-2" />

      
        <div className="px-3 space-y-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Sort by Price</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 group py-1 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={sortOrder === "low-high"}
                onChange={() => onSortChange("low-high")}
                className="w-4 h-4 text-[#5048e5] focus:ring-indigo-500/20"
              />
              <span className="text-sm font-medium text-slate-700">Low → High</span>
            </label>
            <label className="flex items-center gap-3 group py-1 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={sortOrder === "high-low"}
                onChange={() => onSortChange("high-low")}
                className="w-4 h-4 text-[#5048e5] focus:ring-indigo-500/20"
              />
              <span className="text-sm font-medium text-slate-700">High → Low</span>
            </label>
          </div>
          
         
          {sortOrder && (
            <button
              onClick={() => onSortChange(null)}
              className="mt-2 w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Clear Sorting
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
