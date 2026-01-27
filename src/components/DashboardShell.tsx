"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  FileText,
  Clock,
  Settings,
  User,
  Bell,
  Search,
  BookUser,
  Menu,
  Scale,
  Users,
  TriangleAlert,
  FileCog,
  FilePen,
  ChartColumn,
} from "lucide-react";
import { useState } from "react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Inicio", icon: HomeIcon, path: "/", color: "text-blue-600" },
    {
      name: "Ordinario",
      icon: FileText,
      path: "/lista-ordinario",
      color: "text-pink-600",
    },
    {
      name: "Extraordinario",
      icon: BookUser,
      path: "/lista-extraordinarios",
      color: "text-blue-600",
    },
    {
      name: "Inmediata",
      icon: Clock,
      path: "/lista-inmediatas",
      color: "text-green-600",
    },
    {
      name: "Incidentes",
      icon: TriangleAlert,
      path: "/lista-incidentes",
      color: "text-red-600",
    },
  ];

  const menuItemsPenal = [
    {
      name: "Preliminar",
      icon: FileCog,
      path: "/lista-preliminar",
      color: "text-pink-600",
    },
    {
      name: "Preparatoria",
      icon: FilePen,
      path: "/lista-preparatoria",
      color: "text-blue-600",
    },
  ]
  const menuButtons = [
    {
      name: "Estadísticas",
      icon: ChartColumn,
      path: "/stats",
      color: "text-orange-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Sistema Judicial
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-lg transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          } flex-shrink-0 flex flex-col`}
        >
          <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
                <li>
                <div className={`flex items-center ${isSidebarOpen ? "justify-start px-4" : "justify-center"} py-3`}>
                  <Users
                    className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} text-gray-600`}
                  />
                  {isSidebarOpen && (
                    <span className="text-gray-700 font-bold">
                      Procesos De Familia
                    </span>
                  )}
                </div>
              </li>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center ${
                        isSidebarOpen ? "justify-start px-4" : "justify-center"
                      } py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} ${
                          item.color
                        }`}
                      />
                      {isSidebarOpen && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </button>
                  </li>
                );
              })}
              <li className="border-t border-gray-200 my-2"></li>
              <li>
                <div className={`flex items-center ${isSidebarOpen ? "justify-start px-4" : "justify-center"} py-3`}>
                  <Scale
                    className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} text-gray-600`}
                  />
                  {isSidebarOpen && (
                    <span className="text-gray-700 font-bold">
                      Procesos Penales
                    </span>
                  )}
                </div>
              </li>
              {
                menuItemsPenal.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center ${
                          isSidebarOpen ? "justify-start px-4" : "justify-center"
                        } py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} ${
                            item.color
                          }`}
                        />
                        {isSidebarOpen && (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </button>
                    </li>
                  );
                })
              }
            </ul>
            
            <ul>
              <li className="border-t border-gray-200 my-2"></li>
              <li>
                <div className={`flex items-center ${isSidebarOpen ? "justify-start px-4" : "justify-center"} py-3`}>
                  <ChartColumn
                    className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} text-gray-600`}
                  />
                  {isSidebarOpen && (
                    <span className="text-gray-700 font-bold">
                      Estadísticas
                    </span>
                  )}
                </div>
              </li>
              {
                menuButtons.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center ${
                          isSidebarOpen ? "justify-start px-4" : "justify-center"
                        } py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isSidebarOpen ? "mr-3" : ""} ${
                            item.color
                          }`}
                        />
                        {isSidebarOpen && (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </button>
                    </li>
                  );
                })
              }

            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}