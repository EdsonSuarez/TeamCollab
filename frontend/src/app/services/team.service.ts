import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private env: String;
  constructor(private http: HttpClient) { 
    this.env = environment.APP_URL;
  }

  add(team: any) {
    return this.http.post<any>(this.env + "team/add", team);
  }

  addDetail(team: any) {
    return this.http.post<any>(this.env + "detailTeam/add", team);
  }

  getTeams() {
    return this.http.get<any>(this.env + "team/getTeams");
  }

  getUsers(team: any) {
    return this.http.get<any>(this.env + 'team/getUsers/' + team._id);
  }

  update(team: any) {
    return this.http.put<any>(this.env + 'team/update', team);
  }

  delete(team: any) {
    return this.http.delete<any>(this.env + 'team/delete/' + team._id)
  }

  getTeamAdmin() {
    return this.http.get<any>(this.env + "team/getAdmin");
  }
  
  deleteDetail(team: any) {
    return this.http.delete<any>(this.env + 'detailTeam/delete/' + team._id);
  }
}
