import { TipoTrabajoAdministrativo } from "./tipo-trabajo-administrativo";
import { Imagen } from "./imagen";
import { Distrito } from "./distrito";


export class TrabajoAdministrativo {
    inicio:string;
    fin:string;
    observaciones: string;
    distrito: Distrito;
    tipoTrabajoAdmin: TipoTrabajoAdministrativo;
    adjuntos:Array<Imagen>;
    inspectorId:number;

}
