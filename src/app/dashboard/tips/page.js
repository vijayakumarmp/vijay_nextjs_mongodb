"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { Divide } from "lucide-react";

export default function TipsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    phone: "",
  });

  const router = useRouter();




  

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-6">
      Stay highdrated and drink mor water
    </div>
  );
}
