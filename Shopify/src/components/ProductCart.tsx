import { Link } from "react-router-dom";
import type { Product } from "../types/product";

import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";

export default function ProductCart({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/40 group hover:shadow-xl transition-all flex flex-col h-full">
      <div className="aspect-square bg-white/60 rounded-lg mb-4 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined text-xl">favorite</span>
        </button>
      </div>

      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#5048e5] uppercase tracking-wider">
            {product.category?.name || "Premium"}
          </span>
          <div className="flex items-center text-amber-400">
            <span className="material-symbols-outlined text-xs fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[10px] font-bold text-slate-500 ml-1">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-bold text-slate-800 line-clamp-1">{product.title}</h3>
        <p className="text-[#5048e5] font-bold">₹{product.price}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isOutOfStock && <p className="text-[10px] text-red-500 font-bold uppercase text-center">Out of Stock</p>}
        <div className="flex gap-2">
          <Link 
            to={`/product/${product.slug}`} 
            className="flex-1 text-center py-2 text-xs font-bold border border-white/60 bg-white/40 rounded-lg text-slate-600 hover:bg-white transition-all"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-2 bg-[#5048e5] text-shadow-blue-50 text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 disabled:bg-slate-300 disabled:shadow-none transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}