import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router } from "@angular/router";

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


  constructor(private board: BoardService, private router: Router) { 
    this.toggle = true;    
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];
    this.sprints = [];
    this.teamProject = [];
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

}
