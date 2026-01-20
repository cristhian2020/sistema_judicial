"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  BookUser,
  TriangleAlert,
  Scale,
  FileCog,
  FilePen,
} from "lucide-react";
import DashboardStats from "@/src/components/DashboardStats";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido al Sistema Judicial
        </h2>
        <p className="text-gray-600">
          Seleccione el módulo correspondiente para gestionar los procesos
          judiciales
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Action Cards */}
      <p className="text-4xl font-bold text-gray-900 mb-6 text-center mt-8">
        Procesos de Familia
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulario Ordinario
              </h3>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <BookUser className="h-8 w-8 text-pink-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/ordinario")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Formulario Ordinario
          </button>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulario Extraordinario
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/extraordinario")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Formulario Extraordinario
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulario Inmediata
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/inmediata")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Formulario Inmediata
          </button>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulario Incidente
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TriangleAlert className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/incidentes")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Formulario Incidente
          </button>
        </div>
      </div>

      <p className="text-4xl font-bold text-gray-900 mb-6 text-center mt-8">
        Procesos Penales
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulario Preliminar
              </h3>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <FileCog className="h-8 w-8 text-pink-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/preliminar")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Formulario Preliminar
          </button>
        </div>

        <div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Formulario Preparatoria
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FilePen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <button
              onClick={() => router.push("/preparatoria")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Formulario Preparatoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
