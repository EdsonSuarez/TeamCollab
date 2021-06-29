import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private env: String;

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL;
  }

  listAdmin() {
    return this.http.get<any>(this.env + 'project/getAll');
  }

  listScrum() {
    return this.http.get<any>(this.env + 'project/getAllScrum');
  }

  listUserLeader() {
    return this.http.get<any>(this.env + 'project/getMyProjects').pipe(
      map((data) => {
        let result: any = { team: [] };
        data.team.forEach((data: any) => {
          result.team.push(data.teamId.projectId);
        });
        return result;
      })
    );
  }

  add(data: any) {
    return this.http.post<any>(this.env + 'project/add', data);
  }

  update(data: any) {
    return this.http.put<any>(this.env + 'project/update', data);
  }

  delete(data: any) {
    return this.http.put<any>(this.env + 'project/delete', data);
  }
}
