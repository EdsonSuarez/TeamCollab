import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env: String;

  constructor(private http: HttpClient, private router: Router) {
    this.env = environment.APP_URL;
  }

  registerUser(user: any) {
    return this.http.post(this.env + 'user/add', user);
  }

  login(user: any) {
    return this.http.post(this.env + 'auth/login', user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('team');
    localStorage.removeItem('project');
    localStorage.removeItem('sprint');
    localStorage.removeItem('task');
    this.router.navigate(['/login']);
  }

  isAdmin() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData.roleId.name !== 'admin' ? false : true;
    }
  }

  isScrumMaster() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData.roleId.name !== 'scrumMaster' ? false : true;
    }
  }

  isUserLeader() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);  
      return decodedJwtData.roleId.name !== 'user' && decodedJwtData.roleId.name !== 'technicalLeader' ? false : true;
    }
  }

  isUser() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData.roleId.name !== 'user' ? false : true;
    }
  }

  idUser() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData._id;
    }
  }

  getDataToken() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) {
      return;
    } else {
      let jwtData = jwtToken.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData;
    }
  }

}
