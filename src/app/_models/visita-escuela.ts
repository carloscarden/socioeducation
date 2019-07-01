import { Establecimiento } from "./establecimiento";
import { TipoVisita } from "./tipo-visita";


export class VisitaEscuela {
    id: number;
    inicio: string;
    fin: string;
    establecimiento: Establecimiento;
    urgente:string;
    inspectorId:number;
    motivos: any;
    observaciones: string;
    acompaniante: string;
    adjuntos: Array<any>;

    
}


