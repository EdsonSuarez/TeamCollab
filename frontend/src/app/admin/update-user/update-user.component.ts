import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  public dataUser: any;
  public listRoles: any;
  public errorMessage: String;
  public hide: string;
  public confirEmail: Boolean;
  public idUser: string;

  constructor( private admin: AdminService, private router: Router, private activatedRoute: ActivatedRoute ) {
    this.dataUser = {};
    this.errorMessage = '';
    this.hide = 'password';
    this.confirEmail = false;
    this.idUser = '';
    this.activatedRoute.params.subscribe((params: any) => {
      this.idUser = params.id;
    });
  }

  ngOnInit(): void {
    this.getUserAdmin();
    this.listRole();
  }

  update() {
    if (!this.confirEmail) {
      if (
        !this.dataUser.fullName ||
        !this.dataUser.email ||
        !this.dataUser.roleId
      ) {
        this.errorMessage = 'Incomplete data';
        this.closeAlert();
      } else {
        if (this.dataUser.password === '') delete this.dataUser.password;
        this.admin.updateUser(this.dataUser).subscribe(
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

  getUserAdmin() {
    this.admin.getUserAdmin(this.idUser).subscribe(
      (res) => {
        this.dataUser = res.user;
        this.dataUser.roleId = res.user.roleId.name;
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
