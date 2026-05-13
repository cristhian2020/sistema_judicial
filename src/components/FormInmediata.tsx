'use client';
import { useState, FormEvent } from 'react';
import { addDoc, collection, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProcesoInmediata } from '@/src/app/types';

interface ProcesoFormProps {
  proceso?: ProcesoInmediata;
  onSubmit: (proceso?: ProcesoInmediata) => void;
  onCancel: () => void;
  isEdit?: boolean;
  collectionName?: string;
}

const ESTADOS_PROCESO = [
  'SENTENCIA',
  'CONCILIACION',
  'DESISTIMIENTO',
  'RETIRO DE LA DEMANDA',
  'EXTINCION POR INACTIVIDAD',
  'RECHAZADAS',
  'POR NO PRESENTADADAS',
  'EXCUSA',
  'REFUSA',
  'DECLINACION',
  'PENDIENTE',
  'OTROS'
];

const TIPOS_PROCESO = [
  'ENMANCIPACION POR DESACUERDO',
  'CONSTITUCION DEL PATRIMONIO FAMILIAR',
  'AUTORIZACION JUDICIAL PARA ADMINISTRAR BIENES',
  'DESACUERDO DE LOS PADRES',
  'VOLUNTARIOS',
  'HOMOLOGACION DE ASISTENCIA FAMILIAR',
];

export default function FormInmediata({
  proceso,
  onSubmit,
  onCancel,
  isEdit = false,
}: ProcesoFormProps) {
  const [nurej, setNurej] = useState(proceso?.nurej || '');
  const [demandados, setDemandados] = useState(proceso?.demandados || '');
  const [demandantes, setDemandantes] = useState(proceso?.demandantes || '');
  const [ci, setCi] = useState(proceso?.ci || '');
  const [fecha_ingreso, setFecha_ingreso] = useState(() => {
    if (proceso?.fecha_ingreso) {
      const d = new Date(proceso.fecha_ingreso);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  });
  const [estado_proceso, setEstado_proceso] = useState(
    proceso?.estado_proceso || 'SENTENCIA'
  );
  const [observacion, setObservacion] = useState(proceso?.observacion || '');
  const [tipoProceso, setTipoProceso] = useState(
    proceso?.proceso || 'ENMANCIPACION POR DESACUERDO'
  );
  const [fojas, setFojas] = useState(proceso?.fojas || 0);
  const [cuerpos, setCuerpos] = useState(proceso?.cuerpos || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const procesoData = {
        nurej,
        demandados,
        demandantes,
        ci,
        fecha_ingreso: (() => {
          if (fecha_ingreso) {
            const [y, m, d] = fecha_ingreso.split('-').map(Number);
            return new Date(y, m - 1, d, 12, 0, 0);
          }
          return new Date();
        })(),
        estado_proceso: estado_proceso as any,
        observacion,
        proceso: tipoProceso as any,
        fojas: Number(fojas),
        cuerpos: Number(cuerpos),
      };

      if (isEdit && proceso?.id) {
        await updateDoc(doc(db, 'inmediata', proceso.id), procesoData);
      } else {
        await addDoc(collection(db, 'inmediata'), procesoData);
      }

      onSubmit(procesoData as ProcesoInmediata);
      setNurej('');
      setDemandados('');
      setDemandantes('');
      setCi('');
      setFecha_ingreso('');
      setEstado_proceso('SENTENCIA');
      setObservacion('');
      setTipoProceso('ENMANCIPACION POR DESACUERDO');
      setFojas(0);
      setCuerpos(0);
    } catch (error) {
      console.error('Error saving document: ', error);
      alert('Error al guardar el proceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 ">N° NUREJ</label>
          <input
            type="text"
            value={nurej}
            onChange={(e) => setNurej(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Tipo de Proceso</label>
          <select
            value={tipoProceso}
            onChange={(e) => setTipoProceso(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
          >
            {TIPOS_PROCESO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Demandantes</label>
          <input
            type="text"
            value={demandantes}
            onChange={(e) => setDemandantes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">C/I</label>
          <input
            type="text"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            placeholder="Ej: 01/2025"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Demandados</label>
          <input
            type="text"
            value={demandados}
            onChange={(e) => setDemandados(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Fecha de Ingreso</label>
          <input
            type="date"
            value={fecha_ingreso}
            onChange={(e) => setFecha_ingreso(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Estado del Proceso</label>
          <select
            value={estado_proceso}
            onChange={(e) => setEstado_proceso(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
          >
            {ESTADOS_PROCESO.map((estado) => (
              <option key={estado} value={estado}>
                {estado.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Fojas</label>
            <input
              type="number"
              value={fojas}
              onChange={(e) => setFojas(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Cuerpos</label>
            <input
              type="number"
              value={cuerpos}
              onChange={(e) => setCuerpos(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
              min="0"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">Observación</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-black"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-white bg-red-500 hover:bg-red-600 focus:outline-none"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Guardar')}
        </button>
      </div>
    </form>
  );
}