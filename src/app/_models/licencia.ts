import { Inspector } from "./inspector";
import { Encuadre } from "./encuadre";

export class Licencia {
    id:number;
    inicio:string;
    fin:string;
    encuadre: Encuadre;
    medica: string;
    codigo: string;
    inspectorId: number;
}
