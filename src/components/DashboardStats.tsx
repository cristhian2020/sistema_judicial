"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Scale,
  FileText,
  Clock,
  AlertTriangle,
  FileCog,
  Gavel,
  FilePen,
  BookUser,
} from "lucide-react";

interface StatsData {
  [key: string]: number;
}

interface ProcessStats {
  name: string;
  collection: string;
  icon: any;
  color: string; // Mantenemos esto para referencia, pero usaremos los objetos de colores
  states: StatsData;
  types: StatsData;
}

// Definimos los colores en hexadecimal para cada proceso
const processColors = {
  ordinario: {
    bg: "#fdf2f8", // pink-50
    border: "#fce7f3", // pink-100
    text: "#9d174d", // pink-800
    icon: "#db2777", // pink-600
  },
  extraordinario: {
    bg: "#eff6ff", // blue-50
    border: "#dbeafe", // blue-100
    text: "#1e40af", // blue-800
    icon: "#2563eb", // blue-600
  },
  inmediata: {
    bg: "#f0fdf4", // green-50
    border: "#dcfce7", // green-100
    text: "#166534", // green-800
    icon: "#16a34a", // green-600
  },
  incidente: {
    bg: "#fef2f2", // red-50
    border: "#fee2e2", // red-100
    text: "#991b1b", // red-800
    icon: "#dc2626", // red-600
  },
  preliminar: {
    bg: "#fefce8", // yellow-50
    border: "#fef9c3", // yellow-100
    text: "#854d0e", // yellow-800
    icon: "#ca8a04", // yellow-600
  },
  preparatoria: {
    bg: "#eff6ff", // blue-50 (mismo que extraordinario)
    border: "#dbeafe", // blue-100
    text: "#1e40af", // blue-800
    icon: "#2563eb", // blue-600
  },
};

export default function DashboardStats() {
  const [stats, setStats] = useState<ProcessStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  const processesDefinition = [
    {
      name: "Proceso Ordinario",
      collection: "ordinario",
      icon: FileText,
      color: "pink",
    },
    {
      name: "Proceso Extraordinario",
      collection: "extraordinario",
      icon: BookUser,
      color: "blue",
    },
    {
      name: "Proceso Inmediata",
      collection: "inmediata",
      icon: Clock,
      color: "green",
    },
    {
      name: "Proceso Incidente",
      collection: "incidente",
      icon: AlertTriangle,
      color: "red",
    },
    {
      name: "Proceso Preliminar",
      collection: "preliminar",
      icon: FileCog,
      color: "yellow",
    },
    {
      name: "Proceso Preparatoria",
      collection: "preparatoria",
      icon: FilePen,
      color: "blue",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          processesDefinition.map(async (proc) => {
            const querySnapshot = await getDocs(
              collection(db, proc.collection),
            );
            return querySnapshot.docs.map((doc) => {
              const data = doc.data();
              let year = "";
              if (data.fecha_ingreso) {
                if (data.fecha_ingreso.toDate) {
                  year = data.fecha_ingreso.toDate().getFullYear().toString();
                } else if (data.fecha_ingreso instanceof Date) {
                  year = data.fecha_ingreso.getFullYear().toString();
                } else {
                  // Try to parse string or timestamp number
                  try {
                    const d = new Date(data.fecha_ingreso);
                    if (!isNaN(d.getTime())) {
                      year = d.getFullYear().toString();
                    }
                  } catch (e) {}
                }
              }

              return {
                collection: proc.collection,
                estado_proceso: data.estado_proceso || "Desconocido",
                proceso: data.proceso || "Desconocido",
                year,
              };
            });
          }),
        );

        const flatData = results.flat();
        setAllData(flatData);

        const uniqueYears = Array.from(
          new Set(flatData.map((d) => d.year).filter((y) => y)),
        ).sort((a, b) => b.localeCompare(a));
        setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const filteredData = selectedYear
      ? allData.filter((d) => d.year === selectedYear)
      : allData;

    const newStats = processesDefinition.map((proc) => {
      const procData = filteredData.filter(
        (d) => d.collection === proc.collection,
      );

      const states: StatsData = {};
      const types: StatsData = {};

      procData.forEach((d) => {
        states[d.estado_proceso] = (states[d.estado_proceso] || 0) + 1;
        types[d.proceso] = (types[d.proceso] || 0) + 1;
      });

      return {
        ...proc,
        states,
        types,
      };
    });

    setStats(newStats);
  }, [allData, selectedYear, loading]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-800">
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Year Filter */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Filtro Global</h2>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Año:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Todos los años</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Family Processes Stats */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Estadísticas Procesos de Familia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.slice(0, 4).map((proc) => {
            const colors =
              processColors[proc.collection as keyof typeof processColors];
            return (
              <div
                key={proc.collection}
                className="bg-white rounded-xl shadow overflow-hidden"
                style={{ borderColor: colors.border, borderWidth: "1px" }}
              >
                <div
                  className="p-4 border-b flex items-center justify-between"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  <h4
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {proc.name}
                  </h4>
                  <proc.icon
                    style={{ color: colors.icon }}
                    className="h-6 w-6"
                  />
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                      Estados de Proceso
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {Object.entries(proc.states).map(([key, count]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key.replace(/_/g, " ")}</span>
                          <span className="font-bold">{count}</span>
                        </li>
                      ))}
                      {Object.keys(proc.states).length === 0 && (
                        <li className="text-gray-400 italic">Sin datos</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                      Tipos de Proceso
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {Object.entries(proc.types).map(([key, count]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key.replace(/_/g, " ")}</span>
                          <span className="font-bold">{count}</span>
                        </li>
                      ))}
                      {Object.keys(proc.types).length === 0 && (
                        <li className="text-gray-400 italic">Sin datos</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penal Processes Stats */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Estadísticas Procesos Penales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.slice(4).map((proc) => {
            const colors =
              processColors[proc.collection as keyof typeof processColors];
            return (
              <div
                key={proc.collection}
                className="bg-white rounded-xl shadow overflow-hidden"
                style={{ borderColor: colors.border, borderWidth: "1px" }}
              >
                <div
                  className="p-4 border-b flex items-center justify-between"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  <h4
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {proc.name}
                  </h4>
                  <proc.icon
                    style={{ color: colors.icon }}
                    className="h-6 w-6"
                  />
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                      Estados de Proceso
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {Object.entries(proc.states).map(([key, count]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key.replace(/_/g, " ")}</span>
                          <span className="font-bold">{count}</span>
                        </li>
                      ))}
                      {Object.keys(proc.states).length === 0 && (
                        <li className="text-gray-400 italic">Sin datos</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                      Tipos de Proceso
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {Object.entries(proc.types).map(([key, count]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key.replace(/_/g, " ")}</span>
                          <span className="font-bold">{count}</span>
                        </li>
                      ))}
                      {Object.keys(proc.types).length === 0 && (
                        <li className="text-gray-400 italic">Sin datos</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
