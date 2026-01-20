"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FormPreliminar from "@/src/components/FormPreliminar";
import { ProcesoPenal } from "@/src/app/types";

export default function EditPreliminarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [proceso, setProceso] = useState<ProcesoPenal | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProceso = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "preliminar", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const procesoData = {
            id: docSnap.id,
            ...data,
            // Convert Firestore Timestamp to Date
            fecha_ingreso: data.fecha_ingreso?.toDate
              ? data.fecha_ingreso.toDate()
              : new Date(data.fecha_ingreso),
          } as ProcesoPenal;

          setProceso(procesoData);
        } else {
          alert("Proceso no encontrado");
          router.push("/lista-preliminar");
        }
      } catch (error) {
        console.error("Error fetching proceso:", error);
        alert("Error al cargar el proceso");
      } finally {
        setLoading(false);
      }
    };

    fetchProceso();
  }, [id, router]);

  const handleSubmit = () => {
    alert("Proceso actualizado correctamente");
    router.push("/lista-preliminar");
  };

  const handleCancel = () => {
    router.push("/lista-preliminar");
  };

  if (loading) {
    return <div className="text-center p-8">Cargando datos del proceso...</div>;
  }

  if (!proceso) {
    return <div className="text-center p-8">No se encontró el proceso.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Editar Proceso Preliminar
      </h1>
      <div className="max-w-4xl mx-auto">
        <FormPreliminar
          proceso={proceso}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={true}
        />
      </div>
    </div>
  );
}
