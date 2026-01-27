"use client";

import DashboardStats from "@/src/components/DashboardStats";

export default function PreparatoriaPage() {


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Estadísticas de los procesos
      </h1>
      <div className="max-w-4xl mx-auto">
        <DashboardStats />
      </div>
    </div>
  );
}
