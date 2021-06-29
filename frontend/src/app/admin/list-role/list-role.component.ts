import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {

  public rolesData: any;
  public errorMessage: String;
  public successMessage: String;

  constructor(private admin: AdminService, private router: Router) { 
    this.rolesData = {};
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit(): void {
    this.admin.listRole().subscribe(
      (res)=>{
        console.log(res)
        this.rolesData = res.roles;
      },
      (err)=>{
        this.errorMessage = err.error;
        this.closeAlert();
      }
    )
  }

  deleteRol(task: any){  
    if(task.name == "admin" || task.name == "user" || task.active == false){
      this.errorMessage = 'this user does not delete'
      this.closeAlert();      
    }else{
      this.admin.deleteRole(task).subscribe(
        (res)=>{
          task.active = false;  
          this.successMessage = 'Role Delete';
          this.closeAlert();        
        },
        (err)=>{
          this.errorMessage = err.error;
          this.closeAlert();  
        }
      )
    }
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
