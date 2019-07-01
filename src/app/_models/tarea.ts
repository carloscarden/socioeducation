import { Actividad } from "./actividad";

export class Tarea {
    id: number;
    inicio: string;
    fin: string;
    detalle: string;
    idInspector: number;
    actividad: Actividad;

}
