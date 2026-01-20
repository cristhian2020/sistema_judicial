'use client';

import { useRouter } from 'next/navigation';
import { ProcesoIncidente } from '@/src/app/types';
import FormIncidente from '@/src/components/FormIncidente';

export default function IncidentePage() {
  const router = useRouter();

  const handleSubmit = (proceso?: ProcesoIncidente) => {
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
        Registro de Proceso Incidente
      </h1>
      <div className="max-w-4xl mx-auto">
        <FormIncidente
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
