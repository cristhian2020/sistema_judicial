// types/index.ts
export type EstadoProceso = 
  | 'SENTENCIA'
  | 'CONCILIACION'
  | 'DESISTIMIENTO'
  | 'RETIRO DE LA DEMANDA'
  | 'EXTINCION POR INACTIVIDAD'
  | 'RECHAZADAS'
  | 'POR NO PRESENTADADAS'
  | 'EXCUSA'
  | 'REFUSA'
  | 'DECLINACION'
  | 'PENDIENTE'
  | 'OTROS'


  export type EstadoProcesoPreliminar = 
  | 'CONCILIACION'
  | 'RECHAZO DE LA DENUNCIA'
  | 'OTRAS FORMAS'
  | 'EXEPCION POR PRESCRIPCION'
  | 'CONVERSION DE ACCIONES'
  | 'DECLINACION E INHIBITORIA'
  | 'EXCUSA'
  | 'RECUSA'
  | 'PENDIENTE'

  export type EstadoProcesoPreparatoria = 
    | 'PROCEDIMIENTO ABREVIADO'
    | 'CRITERIO DE OPORTUNIDAD'
    | 'SUSPENCION CONDICIONAL DEL PROCESO'
    | 'CONCILIACION'
    | 'SOBRESEIMIENTO'
    | 'EXTINCION DE LA ACCION EN ETAPA PREPARATORIA'
    | 'EXTINCION DE LA ACCION POR DURACION MAXIMA'
    | 'DECLINATORIA E INHIBITORIA'
    | 'EXCUSA'
    | 'RECUSA'
    | 'PENDIENTE'
    

export type TipoProcesoExtraordinario = 
  | 'NEGACION DE PATERNIDAD'
  | 'ASISTENCIA FAMILIAR'
  | 'DIVORCIO'
  | 'DECLARACION JUDICIAL DE FILIACION'
  | 'INPUJNACION DE FILIACION'
  | 'NEGACION DE MATERNIDAD'
  | 'COMPROBACION DE MATRIMONIO'
  | 'OPOCICION AL MATRIMONIO'
  | 'DECLARACION DE INTERDICCION'
  | 'CESACION DE INTERDICCION'
  | 'SUSPENCION'
  | 'GUARDA';

  export type TipoProcesoInmediata = 
  | 'ENMANCIPACION POR DESACUERDO'
  | 'CONSTITUCION DEL PATRIMONIO FAMILIAR'
  | 'AUTORIZACION JUDICIAL PARA ADMINISTRAR BIENES'
  | 'DESACUERDO DE LOS PADRES'
  | 'VOLUNTARIOS'
  | 'HOMOLOGACION DE ASISTENCIA FAMILIAR'

  export type TipoProcesoOrdinario = 
  | 'NULIDAD DE MATRIMONIO O DE UNION LIBRE'
  | 'NULIDAD DE SEGUNDO MATRIMONIO'
  | 'NULIDAD DE ACUERDOS EN LA VIA VOLUNTARIA NOTARIADA'
  | 'DIVICION Y PARTICION DE BIENES'
  | 'DETERMINACION DE BIENES PROPIOS'
  | 'RECTIFICACION DE APELLIDO EN PARTIDA DE NACIMIENTO'
  | 'PROCESOS INOMINADOS - OTROS'

  export type TipoProcesoIncidente = 
  | 'AUMENTO DE ASISTENCIA FAMILIAR'
  | 'CESACION A LA ASISTENCIA FAMILIAR'
  | 'DISMINUCION A LA ASISTENCIA FAMILIAR'
  | 'MODIFICACION DE GUARDA'

  export type TipoProcesoPenal = 
  | 'PENAL COMUN'
  | 'VIOLENCIA CONTRA LA MUJER'
  | 'ANTICORRUPCION'

export interface ProcesoExtraordinarioBase {
  id?: string;
  nurej: string;
  demandados: string;
  demandantes: string;
  fecha_ingreso: Date;
  estado_proceso: EstadoProceso;
  observacion: string;
  fojas: number;
  cuerpos: number;
  ci?: string;
}

export interface ProcesoInmediataBase {
  id?: string;
  nurej: string;
  demandados: string;
  demandantes: string;
  fecha_ingreso: Date;
  estado_proceso: EstadoProceso;
  observacion: string;
  fojas: number;
  cuerpos: number;
  ci?: string;
}

export interface ProcesoOrdinarioBase {
  id?: string;
  nurej: string;
  demandados: string;
  demandantes: string;
  fecha_ingreso: Date;
  estado_proceso: EstadoProceso;
  observacion: string;
  fojas: number;
  cuerpos: number;
  ci?: string;
}

export interface ProcesoIncidenteBase {
  id?: string;
  nurej: string;
  demandados: string;
  demandantes: string;
  fecha_ingreso: Date;
  estado_proceso: EstadoProceso;
  observacion: string;
  fojas: number;
  cuerpos: number;
  ci?: string;
}
export interface ProcesoPenalBase {
  id?: string;
  nurej: string;
  demandados: string;
  demandantes: string;
  fecha_ingreso: Date;
  estado_proceso: EstadoProcesoPreliminar | EstadoProcesoPreparatoria;
  observacion: string;
  fojas: number;
  cuerpos: number;
  check_box: boolean;
  ci?: string;
}

export interface ProcesoExtraordinario extends ProcesoExtraordinarioBase {
  proceso: TipoProcesoExtraordinario;
}

export interface ProcesoInmediata extends ProcesoInmediataBase {
  proceso: TipoProcesoInmediata;
}

export interface ProcesoOrdinario extends ProcesoOrdinarioBase{
  proceso: TipoProcesoOrdinario;
}

export interface ProcesoIncidente extends ProcesoIncidenteBase{
  proceso: TipoProcesoIncidente;
}

export interface ProcesoPenal extends ProcesoPenalBase{
  proceso: TipoProcesoPenal;
}