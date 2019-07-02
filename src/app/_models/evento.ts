import { TipoEvento } from "./tipo-evento";
import { Imagen } from "./imagen";
import { Distrito } from "./distrito";



export class Evento {
    id:number;
    inicio:string;
    fin:string;
    tipoEvento: TipoEvento;
    distrito: Distrito;
    lugar: string;
    inspectorId:number;
    adjuntos:Array<Imagen>;

}

