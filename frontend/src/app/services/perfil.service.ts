import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {

  datosUser: any = {};

  constructor( private authService: AuthService ) {
    this.datosUser = authService.getDataToken();
  }
  
}
