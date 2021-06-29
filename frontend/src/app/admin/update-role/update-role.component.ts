import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css'],
})
export class UpdateRoleComponent implements OnInit {
  public dataRole: any;
  public errorMessage: String;
  public hide: Boolean;
  public idRole: String;

  constructor(
    private admin: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dataRole = {};
    this.errorMessage = '';
    this.hide = true;
    this.idRole = '';
    this.activatedRoute.params.subscribe((params: any) => {
      this.idRole = params.id;
    });
  }

  ngOnInit(): void {
    this.admin.getRole(this.idRole).subscribe(
      (res) => {
        this.dataRole = res.role;
      },
      (err) => {
        this.errorMessage = err.error;
        this.dataRole = {};
        this.closeAlert();
      }
    );
  }

  update() {
    if (!this.dataRole.name || !this.dataRole.description) {
      this.idRole = this.errorMessage = 'Incomplete data';
      this.closeAlert();
    } else {
      this.admin.updateRole(this.dataRole).subscribe(
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
