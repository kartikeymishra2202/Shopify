import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { NavLinkItem } from "../types/navigation";
import { useAuth } from "../context/auth/authContext";
import LogoutButton from "./LogoutButton";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const { state } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const isAdmin = state.user?.role === "admin";

  const navLinks: NavLinkItem[] = [
    ...(state.isAuthenticated
      ? isAdmin
        ? [
          { label: "Dashboard", path: "/user" },
          { label: "Add Product", path: "/admin/products/new" },
          { label: <LogoutButton />, path: "/login" },
        ]
        : [
          { label: "Products", path: "/" },
          { label: "Orders", path: "/user/orders" },
          { label: <LogoutButton />, path: "/login" },
        ]
      : [
          { label: "Products", path: "/" },
          { label: "Login", path: "/login" },
        ]),
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-4 bg-transparent">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative min-h-[72px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl px-6 py-2 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#5048e5] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="material-symbols-outlined text-white text-2xl">
                {isAdmin ? "admin_panel_settings" : "shopping_bag"}
              </span>
            </div>
            <span className="font-bold text-slate-900 text-xl hidden md:block tracking-tight">
              {isAdmin ? "Admin Console" : "Shopify"}
            </span>
          </div>

      
          <div className={isAdmin ? "hidden" : "flex-1 max-w-xl relative group hidden sm:block"}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5048e5] transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-[#5048e5]/10 focus:border-[#5048e5]/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-6">

          
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "text-[#5048e5] bg-[#5048e5]/10"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

     
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              {!isAdmin && (
                <NavLink
                  to="/cart"
                  className="relative p-2 text-slate-500 hover:text-[#5048e5] transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">
                    shopping_cart
                  </span>
                </NavLink>
              )}

              <NavLink to="/user" className="group">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md group-hover:border-[#5048e5] transition-all">
                  <img
                    alt="User"
                    src={`https://ui-avatars.com/api/?name=${
                      state.user?.name || "User"
                    }&background=5048e5&color=fff`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </NavLink>
            </div>

            
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <span className="material-symbols-outlined text-2xl">
                menu
              </span>
            </button>
          </div>

    
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 flex flex-col gap-1 lg:hidden animate-in fade-in zoom-in-95">
              {navLinks.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)} 
                  className={({ isActive }) =>
                    `text-sm font-semibold px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "text-[#5048e5] bg-[#5048e5]/10"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
