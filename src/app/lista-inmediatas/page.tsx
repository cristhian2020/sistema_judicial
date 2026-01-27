"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProcesoInmediata } from "@/src/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPrint, FaPlus, FaFileCsv, FaSearch } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function ListaInmediatasPage() {
  const [procesos, setProcesos] = useState<ProcesoInmediata[]>([]);
  const [filteredProcesos, setFilteredProcesos] = useState<ProcesoInmediata[]>(
    [],
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchProcesos();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = procesos.filter((p) => {
      const year =
        p.fecha_ingreso instanceof Date
          ? p.fecha_ingreso.getFullYear().toString()
          : "";
      const matchYear = selectedYear ? year === selectedYear : true;
      const matchEstado = selectedEstado
        ? p.estado_proceso === selectedEstado
        : true;
      const matchTipo = selectedTipo ? p.proceso === selectedTipo : true;
      const matchTerm =
        p.nurej.toLowerCase().includes(term) ||
        p.demandantes.toLowerCase().includes(term) ||
        p.demandados.toLowerCase().includes(term);
      return matchYear && matchEstado && matchTipo && matchTerm;
    });
    setFilteredProcesos(filtered);
  }, [searchTerm, procesos, selectedYear, selectedEstado, selectedTipo]);

  const years = Array.from(
    new Set(
      procesos
        .map((p) =>
          p.fecha_ingreso instanceof Date
            ? p.fecha_ingreso.getFullYear().toString()
            : "",
        )
        .filter((y) => y),
    ),
  ).sort((a, b) => b.localeCompare(a));

  const estados = Array.from(
    new Set(procesos.map((p) => p.estado_proceso).filter((e) => e)),
  ).sort();

  const tipos = Array.from(
    new Set(procesos.map((p) => p.proceso).filter((t) => t)),
  ).sort();

  const fetchProcesos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inmediata"));
      const procesosData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fecha_ingreso: data.fecha_ingreso?.toDate
            ? data.fecha_ingreso.toDate()
            : data.fecha_ingreso
              ? new Date(data.fecha_ingreso)
              : null,
        };
      }) as ProcesoInmediata[];
      setProcesos(procesosData);
      setFilteredProcesos(procesosData);
    } catch (error) {
      console.error("Error al obtener los procesos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proceso?")) return;

    try {
      await deleteDoc(doc(db, "inmediata", id));
      const updatedProcesos = procesos.filter((p) => p.id !== id);
      setProcesos(updatedProcesos);
      alert("Proceso eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el proceso:", error);
      alert("Error al eliminar el proceso");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/inmediata/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = [
      "NUREJ,Tipo,Demandantes,Demandados,Estado,Fecha Ingreso,Cuerpos,Fojas,Observaciones",
    ];
    const rows = filteredProcesos.map((p) => {
      const fecha =
        p.fecha_ingreso instanceof Date
          ? p.fecha_ingreso.toLocaleDateString()
          : "";
      return [
        `"${p.nurej}"`,
        `"${p.proceso}"`,
        `"${p.demandantes}"`,
        `"${p.demandados}"`,
        `"${p.estado_proceso}"`,
        `"${fecha}"`,
        p.cuerpos,
        p.fojas,
        `"${p.observacion || ""}"`,
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "procesos_inmediatas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .container {
            width: 100%;
            max-width: none;
            padding: 0;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid black;
            padding: 4px;
            font-size: 10pt;
          }
          h1 {
            font-size: 14pt;
            margin-bottom: 10px;
          }
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Lista de Procesos Inmediatas
      </h1>

      <div className="flex flex-col gap-4 mb-6 px-4 no-print">
        {/* Top Row: Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por NUREJ, Demandantes o Demandados..."
              className="w-full p-2 pl-10 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {/* <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            Exportar CSV
          </button> */}
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaPrint />
              Imprimir
            </button>
            <Link
              href="/inmediata"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaPlus />
              Nuevo Proceso
            </Link>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los años</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Estados</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado?.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Tipos</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo?.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg mx-4">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                NUREJ
              </th>
              <th scope="col" className="px-6 py-3">
                Demandantes
              </th>
              <th scope="col" className="px-6 py-3">
                Demandados
              </th>
              <th scope="col" className="px-6 py-3">
                Proceso
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha Ingreso
              </th>
              <th scope="col" className="px-6 py-3">
                Cuerpo
              </th>
              <th scope="col" className="px-6 py-3">
                Fojas
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Observaciones
              </th>
              <th scope="col" className="px-6 py-3 no-print">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesos.map((proceso) => (
              <tr
                key={proceso.id}
                className="bg-white border-b hover:bg-gray-50 text-gray-900"
              >
                <td className="px-6 py-4 font-medium">{proceso.nurej}</td>
                <td className="px-6 py-4">{proceso.demandantes}</td>
                <td className="px-6 py-4">{proceso.demandados}</td>
                <td className="px-6 py-4">
                  {proceso.proceso?.replace(/_/g, " ")}
                </td>
                <td className="px-6 py-4">
                  {proceso.fecha_ingreso instanceof Date
                    ? proceso.fecha_ingreso.toLocaleDateString()
                    : "Fecha inválida"}
                </td>
                <td className="px-6 py-4">{proceso.cuerpos}</td>
                <td className="px-6 py-4">{proceso.fojas}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                ${
                  proceso.estado_proceso === "SENTENCIA"
                    ? "bg-green-100 text-green-800"
                    : proceso.estado_proceso === "CONCILIACION"
                      ? "bg-green-100 text-green-800"
                      : proceso.estado_proceso === "DESISTIMIENTO"
                        ? "bg-red-100 text-red-800"
                        : proceso.estado_proceso === "RETIRO DE LA DEMANDA"
                          ? "bg-red-100 text-red-800"
                          : proceso.estado_proceso ===
                              "EXTINCION POR INACTIVIDAD"
                            ? "bg-red-100 text-red-800"
                            : proceso.estado_proceso === "RECHAZADAS"
                              ? "bg-red-100 text-red-800"
                              : proceso.estado_proceso ===
                                  "POR NO PRESENTADADAS"
                                ? "bg-orange-100 text-orange-800"
                                : proceso.estado_proceso === "EXCUSA"
                                  ? "bg-purple-100 text-purple-800"
                                  : proceso.estado_proceso === "REFUSA"
                                    ? "bg-purple-100 text-purple-800"
                                    : proceso.estado_proceso === "DECLINACION"
                                      ? "bg-purple-100 text-purple-800"
                                      : proceso.estado_proceso === "OTROS"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-gray-100 text-gray-800"
                }`}
                  >
                    {proceso.estado_proceso?.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">{proceso.observacion}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2 no-print">
                    <button
                      onClick={() => handleEdit(proceso.id!)}
                      className="inline-flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 ease-in-out transform hover:scale-110"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proceso.id!)}
                      className="inline-flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200 ease-in-out transform hover:scale-110"
                      title="Eliminar"
                    >
                      <FaTrashAlt className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProcesos.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
