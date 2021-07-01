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
    return this.http.post<any>(this.env + 'task/add', task);
  }

  saveTaskImg(task: any){
    return this.http.post<any>(this.env + 'task/addImg', task);
  }

  deleteTask(taskId: any){
    return this.http.delete<any>(this.env + 'task/delete/' + taskId);
  }

  getTasks(){
    return this.http.get<any>(this.env + 'task/get');
  }

  getOneTask(taskId: any){
    return this.http.get<any>(this.env + 'task/get/' + taskId);
  }

  updateTask(task: any){
    return this.http.put<any>(this.env + 'task/updateTask', task);
  }

  getTeam(teamId: any) {
    return this.http.get<any>(this.env + 'detailTeam/getTeam/' + teamId);
  }

  addDetail(user: any) {
    return this.http.post<any>(this.env + "detailTask/add", user);
  }

  deleteDetail(userId: any) {
    return this.http.delete<any>(this.env + 'detailTask/delete/' + userId);
  }
}
