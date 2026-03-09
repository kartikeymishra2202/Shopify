import { useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../hooks/useCart";

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    email: "",
    city: "",
    zip_code: ""
  });const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/user/orders/checkout/", { ...formData, total_amount: finalTotal });
    await dispatch({ type: "CLEAR_CART" });
    
    setShowSuccess(true);
    setTimeout(() => navigate("/user/orders"), 3000);
  } catch (err) {
    console.error("Order failed", err);
  } finally {
    setLoading(false);
  }
};

  const priceTotal = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const shippingCharge = priceTotal > 500 ? 0 : 40; 
  const finalTotal = priceTotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  if (state.items.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
              <button onClick={() => navigate("/")} className="mt-4 text-indigo-600 hover:underline">Continue Shopping</button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <textarea
                  required
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, street..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    required
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-black text-blue-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition transform active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Processing Order..." : `Confirm Order • ₹${finalTotal}`}
              </button>
            </form>
          </div>

          {/* right side :Sumarry of the Order */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={item.image} className="w-12 h-12 object-cover rounded bg-white" alt="" />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="line-clamp-1 max-w-[150px]">{item.title}</span>
                    </div>
                    <span className="font-medium text-gray-300">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{priceTotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-indigo-400">₹{finalTotal}</span>
                </div>
              </div>

              <p className="mt-8 text-[10px] text-gray-500 text-center uppercase tracking-widest">
                Secure Checkout Powered by Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
      {showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white p-10 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Order Placed!</h2>
      <p className="text-gray-500 mt-2">Thank you, {formData.full_name}. Redirecting to your orders...</p>
    </div>
  </div>
)}
    </div>
    
  );
};

export default CheckoutPage;