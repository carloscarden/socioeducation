export class Inspeccion {
  id: number;
  task: string;
  priority: number;
  createdAt: number;
  usuario:{
    id: number;
    username: string;
    role: string
  };
  establecimiento:{
    cue: string;
    distrito: number;
    descripcionDistrito: string;
    region: string
  }
}
