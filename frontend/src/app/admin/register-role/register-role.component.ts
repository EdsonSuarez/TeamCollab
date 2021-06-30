import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.css'],
})
export class RegisterRoleComponent implements OnInit {
  public dataRole: any;
  public errorMessage: String;
  public hide = true;

  constructor(private admin: AdminService, private router: Router) {
    this.dataRole = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {}

  register() {
    if (!this.dataRole.name || !this.dataRole.description) {
      this.errorMessage = 'Incomplete data';
      this.closeAlert();
    } else {
      this.admin.registerRole(this.dataRole).subscribe(
        (res) => {
          this.dataRole = {};
          this.router.navigate(['/listRole']);
        },
        (err) => {
          this.errorMessage = err.error;
          this.closeAlert();
          this.dataRole = {};
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
