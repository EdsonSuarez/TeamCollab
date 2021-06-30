import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AdminService } from "../../services/admin.service";


@Component({
  selector: 'app-list-project-admin',
  templateUrl: './list-project-admin.component.html',
  styleUrls: ['./list-project-admin.component.css']
})
export class ListProjectAdminComponent implements OnInit {

  public projects: any;
  public teams: any;

  constructor(private router: Router, private admin: AdminService) { 
    this.projects = [];
    this.teams = [];
  }

  ngOnInit(): void {
    this.admin.getAllProjects().subscribe(
      (res)=>{
        console.log(res)
        this.projects = res.projects;
      },
      (err)=>{
        console.log(err.error);
      }
    )
  }

  changeProject(project:any){
    console.log(project)
    this.admin.getTeamByProject(project._id).subscribe(
      (res)=>{
        console.log(res)
        this.teams = res.team;
      },
      (err)=>{
        console.log(err.error)
      }
    )
  }

  

}
