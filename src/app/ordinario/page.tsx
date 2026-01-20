'use client';

import { useRouter } from 'next/navigation';
import FormOrdinario from '@/src/components/FormOrdinario';
import { ProcesoOrdinario } from '@/src/app/types';

export default function OrdinarioPage() {
  const router = useRouter();

  const handleSubmit = (proceso?: ProcesoOrdinario) => {
    alert('Proceso guardado correctamente');
    // router.push('/lista-extraordinarios'); // Ejemplo de redirección
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Registro de Proceso Ordinario
      </h1>
      <div className="max-w-4xl mx-auto">
        <FormOrdinario
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
