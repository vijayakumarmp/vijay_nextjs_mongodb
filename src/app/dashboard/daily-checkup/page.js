"use client";

import { useState, useEffect } from "react";

export default function DailyCheckupForm() {
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
        if (!token) {
          console.error("No token found, user might not be logged in.");
          return;
        }

        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Unauthorized: Invalid or expired token.");
          return;
        }

        const data = await response.json();
        console.log("User data fetched:", data);

        if (data.patientId) {
          setFormData((prev) => ({
            ...prev,
            patientId: data.patientId,
            name: data.name,
            age: data.age,
          }));

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
      console.log("Checkup records fetched:", data);

      // Filter records to only include those of the logged-in user
      const filteredRecords = data.checkupRecords.filter(
        (record) => record.patientId === patientId
      );

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
      console.log("result", result);

      if (response.ok) {
        setMessage("Checkup saved successfully!");
        setCheckupRecords((prev) =>
          Array.isArray(prev)
            ? [...prev, { ...formData, date: new Date().toISOString() }]
            : [{ ...formData, date: new Date().toISOString() }]
        );

        setFormData((prev) => ({
          ...prev,
          bp: "",
          temperature: "",
          pulse: "",
        }));
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error submitting checkup:", error);
      setMessage("Error saving checkup.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Daily Checkup</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: "Patient ID", name: "patientId", readOnly: true },
          { label: "Name", name: "name", readOnly: true },
          { label: "Age", name: "age", readOnly: true },
          { label: "Blood Pressure", name: "bp" },
          { label: "Temperature", name: "temperature" },
          { label: "Pulse", name: "pulse" },
        ].map(({ label, name, readOnly }) => (
          <div key={name}>
            <label className="block mb-2 font-semibold">{label}:</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full p-2 border ${
                readOnly ? "bg-gray-100" : ""
              } rounded mb-4`}
              readOnly={readOnly}
              required={!readOnly}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
      <h3 className="text-xl font-bold mt-6">Checkup Records</h3>
      <table className="w-full mt-4 border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {["Patient ID", "Name", "Age", "BP", "Temperature", "Pulse", "Date"].map(
              (header) => (
                <th key={header} className="border p-2">
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {checkupRecords.length > 0 ? (
            checkupRecords.map((record, index) => (
              <tr key={index} className="border">
                {[
                  record.patientId,
                  record.name,
                  record.age,
                  record.bp,
                  record.temperature,
                  record.pulse,
                  new Date(record.date).toLocaleDateString(),
                ].map((value, idx) => (
                  <td key={idx} className="border p-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
