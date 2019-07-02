import { TipoGestionTerritorial } from "./tipo-gestion-territorial";
import { Imagen } from "./imagen";
import { Distrito } from "./distrito";


export class GestionTerritorial {
    inicio:string;
    fin:string;
    observaciones: string;
    distrito: Distrito;
    tipoGestionTerritorial: TipoGestionTerritorial;
    adjuntos:Array<Imagen>;
    inspectorId:number;

}
