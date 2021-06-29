import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private env: String;

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL;
  }
  
  listUsers() {
    return this.http.get<any>(this.env + 'user/get');
  }
  
  registerAdmin(user: any) {
    return this.http.post<any>(this.env + 'user/registerAdmin', user);
  }


  getUser(id: String) {
    return this.http.get<any>(this.env + `user/getUser/${id}`);
  }

  updateUser(user: any) {
    return this.http.put<any>(this.env + 'user/update', user);
  }

  deleteUser(user: any) {
    return this.http.delete<any>(this.env + 'user/deleteUser/' + user._id);
  }

  emailUser(email: String) {
    return this.http.get<any>(this.env + `user/emailUser/${email}`);
  }
  

  listRole() {
    return this.http.get<any>(this.env + 'role/get');
  }

  getRole(id: String) {
    return this.http.get<any>(this.env + `role/getRole/${id}`);
  }

  registerRole(role: any) {
    return this.http.post<any>(this.env + 'role/add', role);
  }

  updateRole(role: any) {
    return this.http.put<any>(this.env + 'role/update', role);
  }
  
  deleteRole(role: any){
    return this.http.put<any>(this.env + 'role/delete', role);
  }


  getAllProjects() {
    return this.http.get<any>(this.env + 'project/getAll');
  }

  getTeamByProject(id:String){
    return this.http.get<any>(this.env + `team/getByProject/${id}`);
  }

  getBoardsByTeam(id: String){
    return this.http.get<any>(this.env + `board/getBoards/${id}`);  
  }

  getTasksByBoard(id: String){
    return this.http.get<any>(this.env + `task/getByTeam/${id}`);  
  }

  



}
