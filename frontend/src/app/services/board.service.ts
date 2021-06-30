import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private env: String; 

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL
  }

  tasksUser(){
    return this.http.get<any>(this.env + 'board/getTasksUser');
  }

  teamsUser(){
    return this.http.get<any>(this.env + 'board/getTeamUser');  
  }

  boardsUser(id: String){
    return this.http.get<any>(this.env + `board/getBoards/${id}`);  
  }

  TasksBoard(id: String){
    return this.http.get<any>(this.env + `board/getTasks/${id}`);  
  }

  getTeamsByProyect(id: String) {
    return this.http.get<any>(this.env + 'board/getTeamsByProject/' + id);
  }

  addBoard(board: any){
    return this.http.post<any>(this.env + 'board/add', board);
  }
}
