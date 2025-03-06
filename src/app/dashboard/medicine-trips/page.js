"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function MedicineTripsPage() {
  const router = useRouter();
   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be logged in.");
      return router.push("/login");
    }
   },[]);
    return <h1 className="text-2xl font-bold">Medicine Trips</h1>;
  }
  