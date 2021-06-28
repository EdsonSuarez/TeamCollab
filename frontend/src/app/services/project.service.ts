import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private env: String;

  constructor(private http: HttpClient) {
    this.env = environment.APP_URL;
  }

  list() {
    return this.http.get<any>(this.env + 'project/getAll');
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
