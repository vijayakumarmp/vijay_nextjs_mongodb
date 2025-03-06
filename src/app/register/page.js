"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked) => {
    setFormData({ ...formData, terms: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError("You must accept the Terms & Conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" width={32} height={26} style={{ maxHeight: "32px" }} />
          <span className="text-2xl font-bold text-center pr-2 pl-2 mb-4" style={{ lineHeight: "30px" }}>Register</span>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Age", name: "age", type: "number" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-700">{label}</label>
                <Input
                  type={type}
                  name={name}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          {[
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
            { label: "Address", name: "address", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700">{label}</label>
              <Input
                type={type}
                name={name}
                placeholder={`Enter your ${label.toLowerCase()}`}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center">
            <Checkbox id="terms" checked={formData.terms} onCheckedChange={handleCheckboxChange} />
            <label htmlFor="terms" className="ml-2 text-gray-600">Accept Terms & Conditions</label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
