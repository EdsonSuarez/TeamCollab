import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TeamService } from "../../services/team.service";
import { AdminService } from "../../services/admin.service";
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
  public usersAll: any;  
  public idProject: String;
  public teamInitial: any;

  constructor(private board: BoardService, public admin: AdminService , private router: Router, public auth: AuthService, public team: TeamService, private activatedRoute: ActivatedRoute) { 
    this.toggle = true;    
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];
    this.sprints = [];
    this.teamProject = [];
    this.usersTeam = [];
    this.usersAll = [];
    this.idProject = '';
    this.teamInitial = [];
    this.activatedRoute.params.subscribe((params: any) => {
      this.idProject = params.id;
    });
  }

  ngOnInit(): void {
    
    let firstTeam = {}
    if(this.idProject != 'inicio'){
      this.board.getTeamsByProyect(this.idProject).subscribe(
        (res)=>{
          console.log("teams by project",res.teamsUser)
          this.teamInitial = res.teamsUser;
          let cont = 0;
          this.teamInitial.forEach((element:any) => {
            if (element.teamId != null) {
              if(cont == 0){                
                firstTeam = {
                  team: element.teamId.name,  
                  idTeam: element.teamId._id
                };
              }
              cont++;
            }  
          });
        },
        (err)=>{
          console.log(err.error)
        }
      )
    }


    if (this.auth.isAdmin()) {

      this.team.getTeamAdmin().subscribe(
        (res)=>{
          console.log(res.team)
          const data = res.team;
          let cont = 0;        
          data.forEach((board: any) => { 
  
            const objBoard = {
              team: board.name,
              project: board.projectId.name,
              idTeam: board._id
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
  
            if(this.idProject == 'inicio'){
              if(cont == 0){
                this.changeTeam(objBoard)
              }
            }else{            
              if(cont == 0){
                this.changeTeam(firstTeam)
              }
            }
            cont++;  
          }) 
        },
        (err)=>{
          console.log(err.error)
        }
      )
      
    }else{
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
  
            if(this.idProject == 'inicio'){
              if(cont == 0){
                this.changeTeam(objBoard)
              }
            }else{            
              if(cont == 0){
                this.changeTeam(firstTeam)
              }
            }
            cont++;  
          })  
  
        },
        (err)=>{
          console.log(err.error)
        }
      )

    }
    
    
    
  }


  cambio(){
  this.toggle = !this.toggle;
  }


  changeTeam(team:any){      
    localStorage.setItem('team',team.idTeam);
    this.board.boardsUser(team.idTeam).subscribe(
      (res)=>{
        console.log("Sprint", res.boards)
        this.sprints = res.boards;
        if(this.sprints.length > 0){
          this.changeSprint(this.sprints[0])
        }else{
          this.taskToDo = [];
          this.taskDoing = [];
          this.taskTesting = [];
          this.taskDone = [];
        }
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
        console.log("tasks", res.tasks)
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

  userList(){
    this.admin.listUsers().subscribe(
      (res) => {
        this.usersAll = res.user;
        console.log(this.usersAll);
        
      },
      (err) => {
        console.log(err.error);
      }
    )
  }
}
