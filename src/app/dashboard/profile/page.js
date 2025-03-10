"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { Divide } from "lucide-react";

export default function ProfilePage() {
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

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please login");
        setLoading(false);
        return router.push("/login");
      }

      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          age: data.user.age || "",
          address: data.user.address || "",
          phone: data.user.phone || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const updatedUser = await res.json();
      setUser(updatedUser.user);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full ">
        {/* Profile Icon and Edit Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-5xl " >  
              
            </div>
          <button className="flex items-center text-blue-500" onClick={handleEdit}>
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-semibold bg-gray-100">Patient ID</td>
              <td className="p-2">{user?.patientId || "N/A"}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold bg-gray-100">Name</td>
              <td className="p-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user?.name || "N/A"
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold bg-gray-100">Age</td>
              <td className="p-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user?.age || "Not provided"
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold bg-gray-100">Address</td>
              <td className="p-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user?.address || "Not provided"
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold bg-gray-100">Phone</td>
              <td className="p-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user?.phone || "Not provided"
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {isEditing && (
          <div className="flex justify-center mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
