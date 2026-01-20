'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FormOrdinario from '@/src/components/FormOrdinario';
import { ProcesoOrdinario } from '@/src/app/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditOrdinarioPage({ params }: PageProps) {
  const router = useRouter();
  const [proceso, setProceso] = useState<ProcesoOrdinario | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using use() hook as recommended in Next.js 15+ for async params
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      fetchProceso(id);
    }
  }, [id]);

  const fetchProceso = async (id: string) => {
    try {
      const docRef = doc(db, 'ordinario', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProceso({
          id: docSnap.id,
          ...data,
          // Handle potential timestamp conversion if needed, though form handles it
          fecha_ingreso: data.fecha_ingreso ? data.fecha_ingreso.toDate() : new Date(), 
        } as ProcesoOrdinario);
      } else {
        alert('No se encontró el proceso');
        router.push('/lista-ordinario');
      }
    } catch (error) {
      console.error('Error al obtener el proceso:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    alert('Proceso actualizado correctamente');
    router.push('/lista-ordinario');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  if (!proceso) {
    return <div className="text-center p-8">No se encontró el registro.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Editar Proceso Ordinario
      </h1>
      <div className="max-w-4xl mx-auto">
        <FormOrdinario
          proceso={proceso}
          isEdit={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
