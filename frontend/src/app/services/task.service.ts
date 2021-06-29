import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private env: String; 

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL
  }

  saveTask(task: any){
    return this.http.post<any>(this.env + 'task/saveTask', task);
  }

  updateTask(task: any){
    return this.http.put<any>(this.env + 'task/updateTask', task);
  }
}
