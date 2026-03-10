import { useEffect, useState } from "react";
import { Outlet, useSearchParams, useOutletContext } from "react-router-dom";
import type { Product } from "../types/product";
import ProductCart from "../components/ProductCart";
import SideBar from "../components/Sidebar";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { fetchCategories, fetchProducts } from "../services/productsApi";

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortType = "low-high" | "high-low" | null;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";

  useEffect(() => {
    fetchCategories().then(setDbCategories).catch(console.error);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params: any = {};

        if (searchQuery) params.search = searchQuery;
        if (currentCategory) params.category = currentCategory;
        if (currentSort === "low-high") params.ordering = "price";
        if (currentSort === "high-low") params.ordering = "-price";

        const response = await fetchProducts(params);
        setProducts(response);
      } catch {
        setError("Failed to sync with server.");
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentCategory, currentSort]);

  const handleCategoryToggle = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentCategory === slug) newParams.delete("category");
    else newParams.set("category", slug);
    setSearchParams(newParams);
  };

  const handleSortChange = (sortValue: SortType | string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortValue) newParams.set("sort", sortValue);
    else newParams.delete("sort");
    setSearchParams(newParams);
  };

  if (error) return <Error message={error} />;

  return (
    <div className="max-w-[1440px] mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/*  Desktop Sidebar optionS*/}
        <aside className="hidden lg:flex sticky top-28 w-80 h-[calc(100vh-140px)] flex-col rounded-xl shadow-2xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-xl">
          <SideBar
            categories={dbCategories}
            selectedCategories={currentCategory ? [currentCategory] : []}
            onCategoriesToggle={handleCategoryToggle}
            sortOrder={currentSort as SortType}
            onSortChange={handleSortChange}
          />
        </aside>

        {/*  Mobile Sidebar Drawer  options*/}
        {isSidebarOpen && (
          <>
            
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            
            <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden">
              <SideBar
                categories={dbCategories}
                selectedCategories={currentCategory ? [currentCategory] : []}
                onCategoriesToggle={handleCategoryToggle}
                sortOrder={currentSort as SortType}
                onSortChange={handleSortChange}
              />
            </div>
          </>
        )}

        
        <div className="flex-1 flex flex-col gap-6 w-full">
          
         
          <header className="bg-white/60 backdrop-blur-xl py-4 px-6 rounded-xl flex items-center justify-between shadow-lg border border-white/40">
            
            <div className="flex items-center gap-4">
              
            
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border rounded-lg bg-white shadow-sm"
              >
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>

              <h1 className="text-xl font-bold text-slate-800">
                Product Catalog
              </h1>

              <span className="px-3 py-1 bg-white/50 border border-white/60 text-[10px] font-bold text-slate-500 rounded-full uppercase">
                {products.length} Items Found
              </span>
            </div>
          </header>

         
          <div className="w-full">
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white/40 rounded-xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-6xl mb-2">
                  search_off
                </span>
                <p className="text-lg">No matches found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCart key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
