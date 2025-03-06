"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const router = useRouter(); 
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    router.push("/login"); // Redirect to login
  };
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">Home</a>
          <a href="/dashboard/profile" className="block px-4 py-2 rounded hover:bg-gray-700">Profile</a>
          <a href="/dashboard/medicine-trips" className="block px-4 py-2 rounded hover:bg-gray-700">Medicine Trips</a>
          <a href="/dashboard/daily-checkup" className="block px-4 py-2 rounded hover:bg-gray-700">Daily Checkup</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-end p-4 bg-gray-100 shadow-md">
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
