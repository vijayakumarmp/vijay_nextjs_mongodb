import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Menu */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Welcome to HealthCare</h1>
        <nav>
          <Link href="/login" className="mr-4 hover:underline">
           Login 
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold">Daily Checkup</h3>
            <p>Regular health checkups to monitor your well-being.</p>
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        <p>© {new Date().getFullYear()} All Rights Reserved | HealthCare</p>
      </footer>
    </div>
  );
}
