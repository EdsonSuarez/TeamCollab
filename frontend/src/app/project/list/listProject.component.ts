import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-list-project',
  templateUrl: './listProject.component.html',
  styleUrls: ['./listProject.component.css'],
})
export class ListProjectComponent implements OnInit {
  public projects: any;
  public cargando: Boolean;
  public dataProject: any;
  public listClass: string;
  public formClass: string;
  public formHide: Boolean;
  public errorMessage: string;
  public confiEdit: Boolean;

  constructor( public authService: AuthService, private projectService: ProjectService, private toastrService: ToastrService ) {
    this.projects = {};
    this.cargando = true;
    this.dataProject = {};
    this.listClass = 'col-lg-12';
    this.formClass = 'col-lg-4';
    this.formHide = false;
    this.errorMessage = '';
    this.confiEdit = false;
  }

  ngOnInit(): void {
    if(this.authService.isAdmin()) this.listAdmin();
    if(this.authService.isScrumMaster()) this.listScrum();
    if(this.authService.isUserLeader()) this.listUserLeader();
    if(localStorage.getItem('sprint') && localStorage.getItem('team')){
      localStorage.removeItem('team');
      localStorage.removeItem('sprint');
    }
  }

  listAdmin() {
    this.projectService.listAdmin().subscribe(
      (res) => {
        this.projects = res.projects;
        this.cargando = false;
      },
      (err) => {
        console.log(err.error);
        this.cargando = false;
      }
    );
  }

  listScrum() {
    this.projectService.listScrum().subscribe(
      (res) => {
        this.projects = res.projects;
        this.cargando = false;
      },
      (err) => {
        console.log(err.error);
        this.cargando = false;
      }
    );
  }

  listUserLeader() {
    this.projectService.listUserLeader().subscribe(
      (res) => {
        this.projects = res.team;
        this.cargando = false;
      },
      (err) => {
        console.log(err.error);
        this.cargando = false;
      }
    );
  }

  nuevo() {
    this.dataProject = {};
    this.listClass = 'col-lg-8';
    this.formHide = true;
    this.confiEdit = false;
  }

  save() {
    if (!this.dataProject.name || !this.dataProject.description) {
      this.errorMessage = 'Incomplete data';
      this.closeAlert();
    } else {
      if (!this.confiEdit) {
        this.projectService.add(this.dataProject).subscribe(
          (res) => {
            this.dataProject = {};
            this.listClass = 'col-lg-12';
            this.formHide = false;
            this.projects.push(res.result);
            this.toastrService.success("Project add with success");
          },
          (err) => {
            this.errorMessage = err.error;
            this.closeAlert();
          }
        );
      } else {
        this.projectService.update(this.dataProject).subscribe(
          (res) => {
            this.listClass = 'col-lg-12';
            this.formHide = false;
            const index = this.projects.indexOf(this.dataProject._id);
            if (index > -1) {
              this.projects[index] = this.dataProject;
            }
            this.dataProject = {};
            this.toastrService.success("Project updated with success");
          },
          (err) => {
            this.errorMessage = err.error;
            this.closeAlert();
          }
        );
      }
    }
  }

  editar(data: any) {
    this.listClass = 'col-lg-8';
    this.formHide = true;
    this.confiEdit = true;
    this.dataProject = data;
    window.scrollTo(0, 0);
  }

  delete(data: any) {
    const resultado = window.confirm(
      `Are you sure you want to delete the selected project: ${data.name}?`
    );
    if (resultado === true) {
      this.projectService.delete(data).subscribe(
        (res) => {
          data.active = false;
          this.toastrService.success("Project deleted with success");
        },
        (err) => {
          this.errorMessage = err.error;
          this.closeAlert();
        }
      );
    }
  }

  changeStatus(status: string) {
    this.dataProject.status = status;
  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000);
  }

  close() {
    this.listClass = 'col-lg-12';
    this.formHide = false;
  }
}
