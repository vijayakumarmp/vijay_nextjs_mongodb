"use client";

import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [latestCheckup, setLatestCheckup] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [barChartOptions, setBarChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkupRecords, setCheckupRecords] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndCheckupData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const userResponse = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const userData = await userResponse.json();
        if (!userData || !userData.patientId) return;

        const userPatientId = userData.patientId;

        const checkupResponse = await fetch("/api/dailycheckup", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const checkupData = await checkupResponse.json();

        const userCheckups = checkupData.checkupRecords.filter(
          (record) => record.patientId === userPatientId
        );
        setCheckupRecords(userCheckups);

        if (userCheckups.length === 0) {
          setChartOptions(getNoDataChart());
          setBarChartOptions(getNoDataBarChart());
          return;
        }

        const latest = userCheckups[userCheckups.length - 1];
        setLatestCheckup(latest);
        updateChart(latest);
        updateBarChart(userCheckups);
      } catch (err) {
        setError("Failed to load data.");
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

    const data = [
      { name: "Blood Pressure", y: 1, status: getStatus(checkup.bp, [90, 120], [121, 140]) },
      { name: "Temperature", y: 1, status: getStatus(checkup.temperature, [36, 37.5], [37.6, 39]) },
      { name: "Pulse", y: 1, status: getStatus(checkup.pulse, [60, 100], [101, 120]) },
    ];

    setChartOptions({
      chart: { type: "pie" },
      title: { text: "Health Checkup Overview" },
      plotOptions: {
        pie: { innerSize: "50%", dataLabels: { enabled: true } },
      },
      series: [{ name: "Status", data }],
    });
  }

  function updateBarChart(checkups) {
    if (checkups.length === 0) {
      setBarChartOptions(getNoDataBarChart());
      return;
    }

    const statusCounts = { Normal: 0, Critical: 0, Danger: 0 };
    checkups.forEach((c) => {
      statusCounts[getStatus(c.bp, [90, 120], [121, 140])]++;
      statusCounts[getStatus(c.temperature, [36, 37.5], [37.6, 39])]++;
      statusCounts[getStatus(c.pulse, [60, 100], [101, 120])]++;
    });

    setBarChartOptions({
      chart: { type: "column" },
      title: { text: "Daily Checkup Report" },
      xAxis: { categories: ["Normal", "Critical", "Danger"] },
      yAxis: { title: { text: "Count" } },
      series: [{ name: "Checkups", data: Object.values(statusCounts) }],
    });
  }

  function getNoDataChart() {
    return {
      chart: { type: "pie" },
      title: { text: "No Checkup Data Available" },
      series: [{ name: "No Data", data: [{ name: "No Records", y: 100, color: "#cccccc" }] }],
    };
  }

  function getNoDataBarChart() {
    return {
      chart: { type: "column" },
      title: { text: "No Checkup Data Available" },
      series: [{ name: "No Data", data: [0, 0, 0] }],
    };
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Manage your profile and checkups here.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Health Overview</h3>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Checkup Summary</h3>
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg mt-6">
        <h3 className="text-lg font-semibold">Checkup Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border p-3">Date</th>
                <th className="border p-3">Blood Pressure</th>
                <th className="border p-3">Temperature</th>
                <th className="border p-3">Pulse</th>
              </tr>
            </thead>
            <tbody>
              {checkupRecords.length > 0 ? (
                checkupRecords.map((record, index) => (
                  <tr key={index} className="border">
                    <td className="border p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="border p-3">{record.bp}</td>
                    <td className="border p-3">{record.temperature}°C</td>
                    <td className="border p-3">{record.pulse}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border p-3 text-center" colSpan="4">No checkup records available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}