import Loading from "../components/Loading";

import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const CartPage = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const priceTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  if (!items) return <Loading />;

  return (
    <div className="w-full px-4 md:px-10 flex justify-center">
      <div className="w-full max-w-[1240px] space-y-8">
        <header className="bg-white/60 backdrop-blur-xl py-8 px-10 rounded-3xl flex items-center justify-between shadow-xl border border-white/40">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#5048e5]/10 rounded-2xl flex items-center justify-center text-[#5048e5]">
              <span className="material-symbols-outlined text-4xl">shopping_cart</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{totalItems} Items selected</p>
            </div>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-32 border-2 border-dashed border-slate-200 text-center">
             <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_basket</span>
             <p className="text-slate-400 text-xl font-bold">Your cart is empty</p>
             <Link to="/" className="mt-4 inline-block text-[#5048e5] font-bold hover:underline">Go back to store</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-6 shadow-lg group">
                  <div className="w-28 h-28 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1">{item.title}</h3>
                    <p className="text-[#5048e5] font-black text-lg mt-1">₹{item.price}</p>
                    <div className="flex items-center gap-3 mt-4 bg-white/40 w-fit rounded-xl p-1 border border-white/60">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        disabled={item.quantity <= 1}
                        onClick={() => dispatch({ type: "DECREMENT_QTY", payload: item.id })}>−</button>
                      <span className="text-sm font-black px-2">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        onClick={() => dispatch({ type: "INCREMENT_QTY", payload: item.id })}>+</button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <span className="font-black text-slate-900 text-xl">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl sticky top-28">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-4 text-slate-600 mb-8">
                <div className="flex justify-between font-bold">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{priceTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest">Free</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-center">
                 <span className="text-slate-400 font-bold">Total</span>
                 <span className="text-3xl font-black text-slate-900">₹{priceTotal}</span>
              </div>
              <button onClick={() => navigate("/checkout")} className="w-full py-4 bg-[#5048e5] text-blue-800 rounded-2xl font-black shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2">
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="w-full mt-4 py-2 text-sm text-red-500 font-bold " onClick={() => dispatch({ type: "CLEAR_CART" })}>
                Clear Shopping Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;