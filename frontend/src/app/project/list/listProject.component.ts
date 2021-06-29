import { Component, OnInit } from '@angular/core';
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

  constructor(private projectService: ProjectService) {
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
    this.list();
  }

  list() {
    this.projectService.list().subscribe(
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
      if(!this.confiEdit) {
        this.projectService.add(this.dataProject).subscribe(
          (res) => {
            this.dataProject = {};
            this.listClass = 'col-lg-12';
            this.formHide = false;
            this.list();
          },
          (err) => {
            this.errorMessage = err.error;
            this.closeAlert();
          }
        );
      } else {
        this.projectService.update(this.dataProject).subscribe(
          (res) => {
            this.dataProject = {};
            this.listClass = 'col-lg-12';
            this.formHide = false;
            this.list();
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
  }

  delete(data: any) {
    const resultado = window.confirm(`Esta seguro que desea eliminar el proyecto seleccionado: ${data.name}?`);
    if (resultado === true) {
      this.projectService.delete(data).subscribe(
        (res) => {
          this.list();
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
