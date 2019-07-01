import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Inspeccion } from '../_models/inspeccion';
import { Establecimiento } from '../_models/establecimiento';
import { HttpClient } from '@angular/common/http';




export interface Todo {
  id: string;
  task: string;
  priority: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection:Todo[] = [
    { id: "a", task: 'task1', priority: 1, createdAt: 1 },
    { id: "b", task: 'task2', priority: 2, createdAt: 3 },
    { id: "c", task: 'task3', priority: 3, createdAt: 4 },
    { id: "d", task: 'task4', priority: 4, createdAt: 5 },
    { id: "e", task: 'task5', priority: 5, createdAt: 6 }
  ];
  constructor(private http: HttpClient) { }


  /********************************************************************** */
                    /* INSPECCIONES*/
  getInspecciones(): Observable<Inspeccion[]> {
    return this.http.get<Inspeccion[]>(`http://localhost:8100/members/inspecciones`);
  }

  addInspeccion(inspeccion: Inspeccion) {
    return this.http.post<any>(`http://localhost:8100/members/addInspeccion`, { inspeccion });
  }

  /********************************************************************** */

  getEscuelas(): Observable<Establecimiento[]> {
    return this.http.get<Establecimiento[]>(`http://localhost:8100/members/establecimientos`);
  }
 
  getTodo(id:number): Observable<Inspeccion> {
    return null;
  }
 
  updateTodo(todo: Todo, id: string) {
    for (var i = 0; i < this.todosCollection.length; i++) {
      if(this.todosCollection[i].id==id){
          this.todosCollection[i]=todo;
      }
    }
    return this.todosCollection;
  }
 
  
 
  removeTodo(id:string) {
    return this.todosCollection;
  }

}
