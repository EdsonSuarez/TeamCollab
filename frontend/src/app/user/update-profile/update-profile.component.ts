import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { profileData } from '../profile/profile.component';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  public errorMessage: String;
  public enabledP: Boolean;
  public changImg: Boolean;
  public confPassword: String;
  public selectedFile: any;

  constructor(
    private admin: AdminService,
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: profileData
  ) {
    this.errorMessage = '';
    this.enabledP = false;
    this.changImg = false;
    this.confPassword = '';
    this.selectedFile = null;
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {}

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  save() {
    if (!this.data.fullName || !this.data.email) {
      this.errorMessage = 'Process failed: Incomplete data';
      this.closeAlert();
    } else {
      if (this.enabledP) {
        if (this.data.password != this.confPassword) {
          this.errorMessage = 'Passwords do not match';
          this.data.password = '';
          this.confPassword = '';
          this.closeAlert();
          return;
        }
      }
      const dataProfile = new FormData();
      dataProfile.append('fullName', String(this.data.fullName));
      dataProfile.append('email', String(this.data.email));
      dataProfile.append('password', String(this.data.password));
      if (this.selectedFile) {
        dataProfile.append('image', this.selectedFile, this.selectedFile.name);
      } 
      this.admin.updateProfile(dataProfile).subscribe(
        (res) => {
          this.data = res.user;
          console.log(this.data);
          
        },
        (err) => {
          this.errorMessage = err.error;
          this.closeAlert();
          console.log(err.error);
          
        }
      );
    }
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
