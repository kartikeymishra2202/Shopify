import { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/user/orders/my-orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        <header className="bg-white/60 backdrop-blur-xl py-8 px-10 rounded-3xl flex items-center justify-between shadow-xl border border-white/40">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#5048e5]/10 rounded-2xl flex items-center justify-center text-[#5048e5]">
              <span className="material-symbols-outlined text-4xl">history</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Manage your past purchases</p>
            </div>
          </div>
          <Link to="/" className="hidden md:block px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            Continue Shopping
          </Link>
        </header>
        
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-xl font-medium">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-lg">
                <div className="bg-white/40 px-10 py-6 flex flex-wrap justify-between items-center border-b border-white/40">
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Placed On</p>
                      <p className="font-bold text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Amount</p>
                      <p className="font-black text-[#5048e5] text-lg">₹{order.total_amount}</p>
                    </div>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-white border border-slate-100 text-[#5048e5] text-xs font-black uppercase tracking-widest shadow-sm">
                    {order.status}
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-8 items-center">
                      <img src={item.product_image} className="w-24 h-24 object-contain bg-white rounded-2xl p-4 border border-slate-100 shadow-sm" alt="" />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{item.product_name}</h4>
                        <p className="text-slate-500 font-medium">Qty: {item.quantity} • ₹{item.price}</p>
                      </div>
                      <button className="px-6 py-2.5 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-700 hover:border-[#5048e5] hover:text-[#5048e5] transition-all">
                        Buy it again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    
  );
};

export default OrderHistory;