'use client';

import { useRouter } from 'next/navigation';
import { ProcesoInmediata } from '@/src/app/types';
import FormInmediata from '@/src/components/FormInmediata';

export default function InmediataPage() {
  const router = useRouter();

  const handleSubmit = (proceso?: ProcesoInmediata) => {
    console.log('Proceso guardado:', proceso);
    // Aquí podrías redirigir a una lista o mostrar un mensaje de éxito
    alert('Proceso guardado correctamente');
    // router.push('/lista-extraordinarios'); // Ejemplo de redirección
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Registro de Proceso Inmediata
      </h1>
      <div className="max-w-4xl mx-auto">
        <FormInmediata
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
