"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DailyCheckupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    bp: "",
    temperature: "",
    pulse: "",
  });
  const [checkupRecords, setCheckupRecords] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const response = await fetch("/api/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data.patientId) {
          setFormData((prev) => ({ ...prev, patientId: data.patientId, name: data.name, age: data.age }));
          fetchCheckupRecords(data.patientId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  async function fetchCheckupRecords(patientId) {
    try {
      const response = await fetch("/api/dailycheckup");
      const data = await response.json();
      const filteredRecords = data.checkupRecords.filter((record) => record.patientId === patientId);
      setCheckupRecords(filteredRecords);
    } catch (error) {
      console.error("Error fetching checkup records:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/dailycheckup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Checkup saved successfully!");
        setCheckupRecords((prev) => [...prev, { ...formData, date: new Date().toISOString() }]);
        setFormData((prev) => ({ ...prev, bp: "", temperature: "", pulse: "" }));
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error submitting checkup:", error);
      setMessage("Error saving checkup.");
    }
  };

  return (
    <div className="w-full max-w-full mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Daily Checkup</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="w-full">
        {["patientId", "name", "age", "bp", "temperature", "pulse"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block font-semibold capitalize">{field.replace("bp", "Blood Pressure")}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${["patientId", "name", "age"].includes(field) ? "bg-gray-100" : ""}`}
              readOnly={["patientId", "name", "age"].includes(field)}
              required={!["patientId", "name", "age"].includes(field)}
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">Submit</button>
      </form>
      <h3 className="text-xl font-bold mt-6">Checkup Records</h3>
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {["Patient ID", "Name", "Age", "BP", "Temperature", "Pulse", "Date & Day", "Time"].map((header) => (
                <th key={header} className="border p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checkupRecords.length > 0 ? (
              checkupRecords.map((record, index) => {
                const dateObj = new Date(record.date);
                return (
                  <tr key={index} className="border">
                    {[record.patientId, record.name, record.age, record.bp, record.temperature, record.pulse,
                      `${dateObj.toLocaleDateString()} (${dateObj.toLocaleDateString(undefined, { weekday: "long" })})`,
                      dateObj.toLocaleTimeString()
                    ].map((value, idx) => (
                      <td key={idx} className="border p-2">{value}</td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="border p-2 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}