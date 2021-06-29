import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {

  public usersData: any;
  public successMessage: String;
  public errorMessage: String;

  constructor(private admin: AdminService) {
    this.usersData = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.admin.listUsers().subscribe(
      (res) => {
        console.log(res)
        this.usersData = res.user;
      },
      (err)=>{
        console.log(err.error)
      }
    );
  }

  changeStatus(user: any) {
    const tempStatus = user.active;
    const tempRol = user.roleId;
    user.active = user.active ? false : true;    
    user.roleId = user.roleId.name;
    this.admin.updateUser(user).subscribe(
      (res) => {
        user.roleId = tempRol;
      },
      (err) => {
        user.active = tempStatus;
        user.roleId = tempRol;
        this.errorMessage = err.error;
        this.closeAlert();
      }
    );
  }

  deleteUser(user: any) {
    this.admin.deleteUser(user).subscribe(
      (res) => {
        const index = this.usersData.indexOf(user);
        if (index > -1) {
          this.usersData.splice(index, 1);
          this.successMessage = 'User delete';
          this.closeAlert();
        }
      },
      (err) => {
        this.errorMessage = err.error;
        this.closeAlert();
      }
    );
  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  closeX() {
    this.successMessage = '';
    this.errorMessage = '';
  }
  
}
