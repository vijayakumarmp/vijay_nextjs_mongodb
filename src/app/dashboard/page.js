"use client";

import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function DashboardPage() {
  const [latestCheckup, setLatestCheckup] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserPatientId, setCurrentUserPatientId] = useState(null);

  useEffect(() => {
    async function fetchUserAndCheckupData() {
      try {
        setLoading(true);

        // 🔹 Fetch current user data (assuming there's an endpoint for this)
        const userResponse = await fetch("/api/users"); // Adjust if needed
        const userData = await userResponse.json();
        
        if (!userData || !userData.patientId) {
          console.warn("No valid user data found.");
          setError("User data unavailable.");
          setLoading(false);
          return;
        }

        const userPatientId = userData.patientId;
        setCurrentUserPatientId("userPatientId",userPatientId);

        console.log("Current User Patient ID:", userPatientId);

        // 🔹 Fetch Checkup Data
        const checkupResponse = await fetch("/dashboard/dailycheckup");
        const checkupData = await checkupResponse.json();

        console.log("API Checkup Response:", checkupData);

        if (!checkupData || !Array.isArray(checkupData.checkupRecords)) {
          console.warn("No checkup records found.");
          setLatestCheckup(null);
          setChartOptions(getNoDataChart());
          return;
        }

        // 🔹 Filter Checkups for the Current User
        const userCheckups = checkupData.checkupRecords.filter(
          (record) => record.patientId === userPatientId
        );

        console.log("Filtered Checkups for User:", userCheckups);

        if (userCheckups.length === 0) {
          console.warn("No checkup data available for this user.");
          setLatestCheckup(null);
          setChartOptions(getNoDataChart());
          return;
        }

        // 🔹 Get the Latest Checkup Entry
        const latest = userCheckups[userCheckups.length - 1];
        setLatestCheckup(latest);
        updateChart(latest);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setChartOptions(getNoDataChart());
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndCheckupData();
  }, []);

  function getStatus(value, normalRange, criticalRange) {
    if (value >= criticalRange[1]) return "Danger";
    if (value >= normalRange[1]) return "Critical";
    return "Normal";
  }

  function updateChart(checkup) {
    if (!checkup) return;

    const bpStatus = getStatus(checkup.bp, [90, 120], [121, 140]);
    const tempStatus = getStatus(checkup.temperature, [36, 37.5], [37.6, 39]);
    const pulseStatus = getStatus(checkup.pulse, [60, 100], [101, 120]);

    const data = [
      { name: "Blood Pressure", y: 1, status: bpStatus, color: getColor(bpStatus) },
      { name: "Temperature", y: 1, status: tempStatus, color: getColor(tempStatus) },
      { name: "Pulse", y: 1, status: pulseStatus, color: getColor(pulseStatus) },
    ];

    console.log("Updated Chart Data:", data);

    setChartOptions({
      chart: { type: "pie" },
      title: { text: "Health Checkup Overview" },
      series: [{ name: "Status", data }],
      tooltip: {
        pointFormat: "<b>{point.status}</b>",
      },
    });
  }

  function getNoDataChart() {
    return {
      chart: { type: "pie" },
      title: { text: "No Checkup Data Available" },
      series: [
        {
          name: "No Data",
          data: [{ name: "No Records", y: 100, color: "#cccccc" }],
        },
      ],
    };
  }

  function getColor(status) {
    return status === "Normal" ? "green" : status === "Critical" ? "yellow" : "red";
  }

  console.log("Loading:", loading);
  console.log("Latest Checkup Data:", latestCheckup);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Manage your profile, medicine trips, and daily checkups here.</p>

      <div className="mt-6">
        {loading ? (
          <p>Loading chart...</p>
        ) : chartOptions ? (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        ) : (
          <p className="text-red-600">Error loading chart.</p>
        )}
      </div>

      {!loading && (!latestCheckup || currentUserPatientId === null) && (
        <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-center">
          <p className="text-yellow-700 font-semibold">⚠️ No checkup data available for your account.</p>
          <p>💡 Tip: Regular checkups help track your health status.</p>
          <a href="/daily-checkup" className="text-blue-500 underline font-medium">
            ➡️ Configure your health checkup now
          </a>
        </div>
      )}

      {latestCheckup && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Last Checkup Data</h3>
          <p>📅 Date: {new Date(latestCheckup.date).toLocaleDateString()}</p>
          <p>🩸 Blood Pressure: {latestCheckup.bp} ({getStatus(latestCheckup.bp, [90, 120], [121, 140])})</p>
          <p>🌡 Temperature: {latestCheckup.temperature}°C ({getStatus(latestCheckup.temperature, [36, 37.5], [37.6, 39])})</p>
          <p>❤️ Pulse: {latestCheckup.pulse} ({getStatus(latestCheckup.pulse, [60, 100], [101, 120])})</p>
        </div>
      )}
    </div>
  );
}
