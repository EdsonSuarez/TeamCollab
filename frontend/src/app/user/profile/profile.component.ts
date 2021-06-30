import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

export interface profileData{
  fullName: String;
  email: String;
  password: String;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public errorMessage: String;

  constructor(private admin: AdminService, public dialog: MatDialog) {
    this.profileData = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.listUser();
  }

  listUser() {
    this.admin.getUser().subscribe(
      (res) => {
        this.profileData = res.user;
        console.log(this.profileData);
        
      },
      (err) => {
        this.errorMessage = err.error; 
        this.closeAlert();
      }
    );
  }

  edit() {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '400px',
      data: this.profileData,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.profileData = res;
    }, (err)=>{
      this.errorMessage = 'Process failed: Error editing data';
      this.closeAlert();
    });    
  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000);
  }

  closeX() {
    this.errorMessage = '';
  }
}
