import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MainLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    
    <div className="min-h-screen w-full flex flex-col bg-[#f6f6f8] selection:bg-indigo-100">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    
      <main className="flex-1 w-full pt-32 pb-10">
        <Outlet context={{ searchQuery }} />
      </main>
    </div>
  );
}