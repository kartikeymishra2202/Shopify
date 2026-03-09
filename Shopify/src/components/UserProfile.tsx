import { useAuth } from "../context/auth/authContext";
import { getCurrentUserId } from "../services/api";
import LogoutButton from "./LogoutButton";
import { Link, useNavigate } from "react-router-dom";
import StaffChatList from "./StaffChatList";

export default function UserProfile() {
  const currentUserId = getCurrentUserId();
  const { state } = useAuth();
  const navigate = useNavigate();
  const isAdmin = state.user?.role === "admin";

  const handleChatClick = () => {
    if (!isAdmin) {
      navigate("/chat/1");
    }
  };

  return (
    <div className="w-full px-4 md:px-10 flex justify-center">
      <div className="w-full max-w-[1240px]">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-[#5048e5] to-indigo-400">
            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl flex items-center justify-center text-4xl font-bold text-[#5048e5]">
                {state.user?.name?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 md:px-12 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200/50 pb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
                  {state.user?.name}
                </h2>
                <p className="text-lg text-slate-500 font-medium">{state.user?.email}</p>
              </div>
              {!isAdmin ? (
                <Link
                  to="/user/orders"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#5048e5] text-white font-bold hover:bg-indigo-600 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined">package_2</span> View My Orders
                </Link>
              ) : (
                <div className="px-8 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold">
                  Admin Dashboard
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
              <div className="p-8 bg-white/40 rounded-2xl border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Email Status
                </p>
                <p className="flex items-center justify-center gap-2 text-xl font-bold text-green-600">
                  <span className="material-symbols-outlined">verified</span> Verified
                </p>
              </div>
              <div className="p-8 bg-white/40 rounded-2xl border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role</p>
                <p className="text-xl font-bold text-[#5048e5] uppercase">{state.user?.role || "user"}</p>
              </div>
              <div className="p-8 bg-white/40 rounded-2xl border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Capabilities
                </p>
                <p className="text-xl font-bold text-slate-700">{isAdmin ? "Chat Operations" : "Shopping Access"}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/50">
              {!isAdmin && (
                <button className="flex-1 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">
                  Edit Profile Settings
                </button>
              )}

              <div className="flex-1">
                <LogoutButton />
              </div>
            </div>

            <div className="p-6 border rounded-2xl mt-6 bg-white/60">
              <h3 className="font-black text-slate-800 mb-4 uppercase text-xs tracking-widest">
                {isAdmin ? "Support Inbox" : "Support"}
              </h3>
              {isAdmin ? (
                <StaffChatList />
              ) : (
                <button onClick={handleChatClick} className="flex items-center gap-2 text-blue-600 hover:underline font-semibold">
                  <span className="material-symbols-outlined">support_agent</span>
                  Contact Support Chat
                </button>
              )}
              {!isAdmin && currentUserId === null && (
                <p className="text-xs text-slate-400 mt-2">Unable to read current user id from token.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
