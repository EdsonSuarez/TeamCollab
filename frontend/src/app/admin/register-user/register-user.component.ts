import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {

  public dataUser: any;
  public listRoles: any;
  public errorMessage: String;
  public hide: string;
  public confirEmail: Boolean;

  constructor( private admin: AdminService, private router: Router ) {
    this.dataUser = {};
    this.errorMessage = '';
    this.hide = 'password';
    this.confirEmail = false;
  }

  ngOnInit(): void {
    this.listRole();
  }

  register() {
    if (!this.confirEmail) {
      if (
        !this.dataUser.fullName ||
        !this.dataUser.email ||
        !this.dataUser.password ||
        !this.dataUser.roleId
      ) {
        this.errorMessage = 'Incomplete data';
        this.closeAlert();
      } else {
        this.admin.registerAdmin(this.dataUser).subscribe(
          (res) => {
            this.dataUser = {};
            this.router.navigate(['/listUsers']);
          },
          (err) => {
            console.log(err);
            this.errorMessage = err.error;
            this.closeAlert();
          }
        );
      }
    } else {
      this.errorMessage = 'Existing email';
      this.closeAlert();
    }
  }

  valiEmail() {
    this.admin.validEmailUser(this.dataUser.email).subscribe(
      (res) => {
        this.confirEmail = res.vali;
        if (this.confirEmail) {
          this.errorMessage = 'Existing email';
          this.closeAlert();
        }
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  listRole() {
    this.admin.listRole().subscribe(
      (res) => {
        this.listRoles = res.roles;
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  showPass() {
    if(this.hide === 'password') this.hide = 'text';
    else this.hide = 'password';
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
