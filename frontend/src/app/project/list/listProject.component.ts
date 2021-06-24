import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-list-project',
  templateUrl: './listProject.component.html',
  styleUrls: ['./listProject.component.css']
})
export class ListProjectComponent implements OnInit {

  public projects: any;
  public cargando: Boolean;

  constructor(private projectService: ProjectService) { 
    this.projects = {};
    this.cargando = true;
  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.projectService.list().subscribe(
      (res) => {
        console.log(res);
        this.projects = res.projects;
        this.cargando = false;
      },
      (err) => {
        console.log(err.error);
        this.cargando = false;
      }
    );
  }

}
