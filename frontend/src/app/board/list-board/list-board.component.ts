import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TeamService } from "../../services/team.service";
import { AdminService } from "../../services/admin.service";
import { ProjectService } from "../../services/project.service";

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
  public projects: any;
  public registerTeam:any;
  public message: String;
  public UserSelect: any;
  public userTemp: any;
  public teamTemp: any;

  constructor(private board: BoardService, public admin: AdminService , private router: Router, public auth: AuthService, public team: TeamService, private activatedRoute: ActivatedRoute, private project: ProjectService) { 
    this.toggle = true;    
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];
    this.sprints = [];
    this.teamProject = [];
    this.teamTemp = [];
    this.usersTeam = [];
    this.usersAll = [];
    this.idProject = '';
    this.teamInitial = [];
    this.projects = [];
    this.registerTeam = {};
    this.message = '';
    this.activatedRoute.params.subscribe((params: any) => {
      this.idProject = params.id;
    });
    this.UserSelect = [];
    this.userTemp = []; 
  }

  ngOnInit(): void {
    
    let firstTeam = {}
    if(this.idProject != 'inicio'){
      if(this.auth.isAdmin()){

        this.admin.getTeamByProject(this.idProject).subscribe(
          (res)=>{
            console.log("teams by project",res.team)
            this.teamInitial = res.team;
            let cont = 0;
            this.teamInitial.forEach((element:any) => {              
              if(cont == 0){                
                firstTeam = {
                  team: element.name,  
                  idTeam: element._id
                };
              }
              cont++;
                
            });
          },
          (err)=>{
            console.log(err.error)
          }
        )
      }else{
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
                console.log("first team", firstTeam)
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
                console.log("first team", firstTeam)
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
      },
      (err) => {
        console.log(err.error);
      }
    )
  }

  userAdd(){
    let team = {userId: this.UserSelect, teamId: this.usersTeam[0].teamId }
    this.team.addDetail(team).subscribe(
      (res) => {
        team = res.result;
        this.usersAll.forEach((element:any)=> {
          if (element._id === this.UserSelect) {
            this.userTemp.userId = element;
            this.userTemp._id = this.usersTeam[0]._id ;
          }
        });
        this.usersTeam.push(this.userTemp);
        let team1 = {idTeam: this.usersTeam[0].teamId};
        this.usersTeamF(team1);
      },
      (err) => {
        console.log(err.error);
      }
    )
  }

  userDelete(detail:any){
    let team = {_id: detail._id}
    console.log(team);
    this.team.deleteDetail(team).subscribe(
      (res) => {
        console.log(res);
        const index = this.usersTeam.indexOf(detail);
        if (index > -1){
          this.usersTeam.splice(index, 1);
        }
      },
      (err) => {
        console.log(err.error);
      }
    )
  }


  viewProjects(){
    if(this.auth.isAdmin()){
      this.project.listTrue().subscribe(
        (res)=>{  
          this.projects = res.projects;
        },
        (err)=>{
          console.log(err)
        }
      )
    }else{

    }
  }


  saveProject(){
    if(!this.registerTeam.name && !this.registerTeam.projectId){  
      this.message = 'Imcomplete Data'
      this.closeAlert();
    }else{
      console.log("datos team",this.registerTeam)
      this.team.add(this.registerTeam).subscribe(
        (res)=>{
          console.log(res);
          const objBoard = {
            team: res.teamResult.name,
            project: res.teamResult.projectId.name,
            idTeam: res.teamResult._id
          }
          this.teamProject.push(objBoard)
          this.registerTeam = {};
          this.message = 'Team add successful'
          this.closeAlert();
        },
        (err)=>{
          console.log(err.error);
          this.message = err.error;
          this.closeAlert();
        }
      )
    }
  }

  saveSprint(){
    if(!this.registerTeam.name && !this.registerTeam.description){  
      this.message = 'Imcomplete Data'
      this.closeAlert();
    }else{
      this.registerTeam.teamId = localStorage.getItem('team');  
      this.board.addBoard(this.registerTeam).subscribe(
        (res)=>{          
          this.sprints.push(res.result)
          this.registerTeam = {};
          this.message = 'Team add successful'
          this.closeAlert();     
        },
        (err)=>{
          console.log(err.error)
          this.message = err.error;
          this.closeAlert();
        }
      )
    }
    
    
  }

  


  closeAlert() {
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  closeX() {
    this.message = '';
  }



}
