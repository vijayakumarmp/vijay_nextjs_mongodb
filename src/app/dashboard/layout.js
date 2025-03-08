"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaBriefcaseMedical, FaClipboardList, FaLightbulb, FaBars } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${menuOpen ? "w-64" : "w-20"} p-4 flex flex-col`}>
        {/* Profile Section */}
        <div className="flex items-center justify-between">
          {menuOpen && <h2 className="text-xl font-bold">Dashboard</h2>}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            <FaBars size={20} />
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex  mt-4">
         </div>

        {/* Navigation Menu */}
        <nav className="mt-6 space-y-4">
          <a href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaHome /> {menuOpen && <span>Home</span>}
          </a>
          <a href="/dashboard/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaUser /> {menuOpen && <span>Profile</span>}
          </a>
          <a href="/dashboard/medicine-trips" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaBriefcaseMedical /> {menuOpen && <span>Medical</span>}
          </a>
          <a href="/dashboard/daily-checkup" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaClipboardList /> {menuOpen && <span>Daily Check</span>}
          </a>
          <a href="/dashboard/tips" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FaLightbulb /> {menuOpen && <span>Tips</span>}
          </a>
        </nav>

        {/* Tip of the Day */}
        {menuOpen && <div className="mt-6 text-sm text-gray-300 border-t pt-4">💡 Tip of the Day: Stay Hydrated!</div>}
      </aside>

      {/* Main Content (Full-Width Fluid) */}
      <main className="flex-1 flex flex-col w-full">
        {/* Top Navbar */}
        <header className="flex justify-end p-4 bg-gray-100 shadow-md">
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 w-full">{children}</div>
      </main>
    </div>
  );
}
