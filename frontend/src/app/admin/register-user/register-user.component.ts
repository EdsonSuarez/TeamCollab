import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  public dataUser: any;
  public listRoles: any;
  public errorMessage: String;
  public hide = true;
  
  constructor( private admin: AdminService, private router: Router ) {
    this.dataUser = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.listRole();
  }

  register() {
    if(!this.dataUser.fullName || !this.dataUser.email || !this.dataUser.password || !this.dataUser.roleId) {
      this.errorMessage = 'Incomplete data'
      this.closeAlert();
    } else {
      this.admin.registerAdmin(this.dataUser).subscribe(
        (res)=> {
          this.dataUser = {};
          this.router.navigate(['/listUsers']);
        },
        (err)=> {
          console.log(err)
          this.errorMessage = err.error;
          this.closeAlert();
        }
      )
    }
  }

  listRole() {
    this.admin.listRole().subscribe(
      (res) => {
        this.listRoles = res.roles;
      },
      (err)=>{
        console.log(err.error)
      }
    );
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
