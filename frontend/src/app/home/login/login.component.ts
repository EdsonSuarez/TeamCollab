import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginData: any;
  public errorMessage: String;

  constructor( private router: Router, private authService: AuthService) {
    this.loginData = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      console.log('Failed process: Incomplete data');
      this.errorMessage = 'Failed process: Incomplete data';
      this.closeAlert();
      this.loginData = {};
    } else {
      this.authService.login(this.loginData).subscribe(
        (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.jwtToken);
          if(this.authService.isAdmin()){
            this.router.navigate(['/project']);
          }else if(this.authService.isScrumMaster()){
            this.router.navigate(['/project']);
          }else{
            this.router.navigate(['/board']);
          }
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;
          this.closeAlert();
          this.loginData = {};
        }
      );
    }
  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  closeX() {
    this.errorMessage = '';
  }

}
