import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TeamService } from "../../services/team.service";
@Component({
  selector: 'app-list-board',
  templateUrl: './list-board.component.html',
  styleUrls: ['./list-board.component.css']
})
export class ListBoardComponent implements OnInit {

  public toggle: Boolean;  
  public taskToDo: any;
  public taskDoing: any;
  public taskTesting: any;
  public taskDone: any;
  public sprints: any;
  public teamProject: any;
  public usersTeam: any;

  constructor(private board: BoardService, private router: Router, public auth: AuthService, public team: TeamService) { 
    this.toggle = true;    
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];
    this.sprints = [];
    this.teamProject = [];
    this.usersTeam = [];
  }

  ngOnInit(): void {
    
    // add team y project
    this.board.teamsUser().subscribe(
      (res)=>{
        console.log("teamsUser", res.teamsUser)
        const data = res.teamsUser;
        let cont = 0;
        data.forEach((board: any) => { 

          const objBoard = {
            team: board.teamId.name,
            project: board.teamId.projectId.name,
            idTeam: board.teamId._id
          }
  
          let noExiste = true;
          this.teamProject.forEach((element:any) => {
            if(element.team == objBoard.team){
              noExiste = false;
            }
          });
  
          if(noExiste){
            this.teamProject.push(objBoard)
          }

          if(cont == 0){
            this.changeTeam(objBoard)
          }

          cont++;  
        })  

      },
      (err)=>{
        console.log(err.error)
      }
    )
  }


  cambio(){
  this.toggle = !this.toggle;
  }


  changeTeam(team:any){      
    localStorage.setItem('team',team.idTeam);
    this.board.boardsUser(team.idTeam).subscribe(
      (res)=>{
        console.log(res.boards)
        this.sprints = res.boards;
        this.changeSprint(this.sprints[0])
      },
      (err)=>{
        console.log(err.error)
      }
    )
  }


  changeSprint(sprint: any){

    console.log(sprint)
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];

    localStorage.setItem('sprint',sprint._id);
    this.board.TasksBoard(sprint._id).subscribe(
      (res)=>{
        console.log(res.tasks)
        const data = res.tasks;
        data.forEach((task: any) => {  
          
          switch (task.status) {
            case "to-do":
              this.taskToDo.push(task)
              break;
            case "doing":
              this.taskDoing.push(task)
              break;
            case "testing":
              this.taskTesting.push(task)
              break;
            case "done":
              this.taskDone.push(task)
              break;          
            default:
              break;
          }           
          
        });
      },
      (err)=>{
        console.log(err.error);
      }
    )
  }

  usersTeamF(team:any){
    team._id = team.idTeam;
    this.team.getUsers(team).subscribe(
      (res)=>{
      this.usersTeam = res.team;
      },
      (err)=>{
        console.log(err.error);
      }
    );    
  }

  getTeam(team: any) {{
    this.team.getUsers(team).subscribe(
      (res)=>{
      console.log("!!!!!qqqq1111111", res);
      },
      (err)=>{
        console.log(err.error);
      }
    ); 
    console.log(team.idTeam)
    return team.idTeam;
  }}
}
