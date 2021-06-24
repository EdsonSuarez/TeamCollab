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
}
