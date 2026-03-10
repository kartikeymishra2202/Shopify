import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { useParams } from "react-router-dom";
import {  fetchProductBySlug } from "../services/productsApi";

import Loading from "../components/Loading";
import Error from "../components/Error";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";


export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();
    const handleAddToCart = () => {
      if (!product) return;
      dispatch({ type: "ADD_TO_CART", payload: product });
  
  
      toast.success(`${product?.title} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    };

  useEffect(() => {
    async function fetchDetail(){
      try {
        setIsLoading(true);
        setError(null);
        if (!slug) {
          setProduct(null);
          setError("Missing product slug.");
          return;
        }
        const response = await fetchProductBySlug(slug);
        if(response === "data does not exist"){
          setProduct(null);
          return ;
        }
        setProduct(response);
      } catch (e: unknown) {
         setError(String(e))
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Product not found
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 bg-white rounded-2xl shadow-sm p-8">

      
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[420px] w-full object-contain"
            />
          </div>

         
          <div className="flex flex-col gap-5">

            <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl font-bold text-gray-900">
                ₹ {product.price}
              </span>

              <span className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
                ⭐ {product.rating}
              </span>
            </div>

            <div className="text-sm text-gray-500 capitalize">
              Category: <span className="font-medium">{product.category.name}</span>
            </div>

            <div
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </div>

            <div className="mt-6">
              <button
                disabled={product.stock === 0 ||  !product}
                onClick={handleAddToCart
                }
                className={`px-8 py-3 rounded-lg text-base font-medium transition
                  ${
                    product.stock === 0
                      ? "bg-gray-300 cursor-not-allowed text-gray-200"
                      : "bg-indigo-600 hover:bg-indigo-700 text-gray-400"
                  }
                `}
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
