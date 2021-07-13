import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TeamService } from '../../services/team.service';
import { AdminService } from '../../services/admin.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from 'src/app/services/task.service';
// import { SaveTaskComponent } from "../../task/save-task/save-task.component";
@Component({
  selector: 'app-list-board',
  templateUrl: './list-board.component.html',
  styleUrls: ['./list-board.component.css'],
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
  public registerTeam: any;
  public message: String;
  public UserSelect: any;
  public userTemp: any;
  public teamTemp: any;
  public sprint: any;
  public detaTask: any;
  public objBoard: any;
  public projectTitle: string;
  public teamName: String;

  constructor(
    private board: BoardService,
    public admin: AdminService,
    private router: Router,
    public auth: AuthService,
    public team: TeamService,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private project: ProjectService,
    // public taskk: SaveTaskComponent
  ) {
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
    this.sprint = [];
    this.projectTitle = '';
    this.teamName = '';
  }

  ngOnInit(): void {
    let firstTeam = {};
    if (this.idProject != 'inicio') {
      if (this.auth.isAdmin()) {
        this.admin.getTeamByProject(this.idProject).subscribe(
          (res) => {
            console.log('teams by project', res.team);
            this.teamInitial = res.team;
            console.log(res.team);
            
            let cont = 0;
            this.teamInitial.forEach((element: any) => {
              if (cont == 0) {
                firstTeam = {
                  team: element.name,
                  idTeam: element._id,
                };
              }
              cont++;
            });
          },
          (err) => {
            console.log(err.error);
          }
        );
      } else {
        this.board.getTeamsByProyect(this.idProject).subscribe(
          (res) => {
            console.log('teams by project', res.teamsUser);
            this.teamInitial = res.teamsUser;
            let cont = 0;
            this.teamInitial.forEach((element: any) => {
              if (element.teamId != null) {
                if (cont == 0) {
                  firstTeam = {
                    team: element.teamId.name,
                    idTeam: element.teamId._id,
                  };
                }
                cont++;
              }
            });
          },
          (err) => {
            console.log(err.error);
          }
        );
      }
    }

    if (this.auth.isAdmin()) {
      this.team.getTeamAdmin().subscribe(
        (res) => {
          console.log("estoy mirando",res.team)
          
          const data = res.team;
          let cont = 0;
          data.forEach((board: any) => {
            const objBoard = {
              team: board.name,
              project: board.projectId.name,
              idTeam: board._id,
              idProject: board.projectId._id
            };

            let noExiste = true;
            this.teamProject.forEach((element: any) => {
              if (element.team == objBoard.team) {
                noExiste = false;
              }
            });

            if (noExiste) this.teamProject.push(objBoard);
            console.log(this.idProject);
            
            if (this.idProject == 'inicio') {
              if (cont == 0) {
                this.changeTeam(objBoard);
              }
            } else {
              if (cont == 0) {
                console.log('first team', firstTeam);
                this.changeTeam(firstTeam);
              }
            }
            cont++;
          });
        },
        (err) => {
          console.log(err.error);
        }
      );
    } else {
      this.board.teamsUser().subscribe(
        (res) => {
          // console.log('teamsUser', res.teamsUser);
          const data = res.teamsUser;
          let cont = 0;
          data.forEach((board: any) => {
            const objBoard = {
              team: board.teamId.name,
              project: board.teamId.projectId.name,
              idTeam: board.teamId._id,
              idProject: board.teamId.projectId._id
            };

            let noExiste = true;
            this.teamProject.forEach((element: any) => {
              if (element.team == objBoard.team) {
                noExiste = false;
              }
            });

            if (noExiste) this.teamProject.push(objBoard);
            
            if(this.idProject == 'inicio') {            
              if(localStorage.getItem('sprint') && localStorage.getItem('team')) {
                if(cont == 0) {
                  // console.log("existe local estorage de T & S")
                  const sprint = { _id: localStorage.getItem('sprint')};                
                  this.changeSprint(sprint)
                }
              } else {
                if(cont == 0){
                  this.changeTeam(objBoard)
                }
              }
            } else {
              if (cont == 0) {
                console.log('first team', firstTeam);
                this.changeTeam(firstTeam);
              }
            }
            cont++;
          });
        },
        (err) => {
          console.log(err.error);
        }
      );
    }
  }

  deleteTask(taskId: any){
    // let taskId = localStorage.getItem('team');
    // const taskId = this.idTask;
    this.taskService.deleteTask(taskId).subscribe(
      (res: any) => {
        console.log('Deleted Task');
        // window.location.reload();
        this.ngOnInit();
        document.getElementById('btn-close-modal')?.click();
        
        // this.router.navigate(['/board/inicio']);
      },
      (err) => {
        console.log(err);
        // this.errorMessage = err.error;
        // this.closeAlert(3000);
      }
    )
  }

  cambio() {
    this.toggle = !this.toggle;
  }

  changeTeam(team: any) {
    localStorage.setItem('team', team.idTeam);
    localStorage.setItem('project', team.idProject);
    console.log(team);
    this.projectTitle = team.project;
    this.teamName = team.team;
    
    this.usersTeamF(team);
    this.board.boardsUser(team.idTeam).subscribe(
      (res) => {
        console.log('Sprint', res.boards);
        this.sprints = res.boards;
        if (this.sprints.length > 0) {
          this.changeSprint(this.sprints[0]);
        } else {
          this.taskToDo = [];
          this.taskDoing = [];
          this.taskTesting = [];
          this.taskDone = [];
        }
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  changeSprint(sprint: any) {
    // console.log(sprint);
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];

    localStorage.setItem('sprint', sprint._id);
    this.board.TasksBoard(sprint._id).subscribe(
      (res) => {
        // console.log('tasks', res.tasks);
        const data = res.tasks;
        data.forEach((task: any) => {
          switch (task.status) {
            case 'to-do':
              this.taskToDo.push(task);
              break;
            case 'doing':
              this.taskDoing.push(task);
              break;
            case 'testing':
              this.taskTesting.push(task);
              break;
            case 'done':
              this.taskDone.push(task);
              break;
            default:
              break;
          }
        });
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  usersTeamF(team: any) {
    console.log(team.project);
    this.teamName = team.team;
    team._id = team.idTeam;
    this.team.getUsers(team).subscribe(
      (res) => {
        this.usersTeam = res.team;
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  userList() {
    this.admin.listUsers().subscribe(
      (res) => {
        this.usersAll = res.user;
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  userAdd() {
    let team = { userId: this.UserSelect, teamId: this.usersTeam[0].teamId };
    this.team.addDetail(team).subscribe(
      (res) => {
        team = res.result;
        this.usersAll.forEach((element: any) => {
          if (element._id === this.UserSelect) {
            this.userTemp.userId = element;
            this.userTemp._id = this.usersTeam[0]._id;
          }
        });
        this.usersTeam.push(this.userTemp);
        let team1 = { idTeam: this.usersTeam[0].teamId };
        this.usersTeamF(team1);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  userDelete(detail: any) {
    let team = { _id: detail._id };
    console.log(team);
    this.team.deleteDetail(team).subscribe(
      (res) => {
        console.log(res);
        const index = this.usersTeam.indexOf(detail);
        if (index > -1) {
          this.usersTeam.splice(index, 1);
        }
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  viewProjects() {
    if (this.auth.isAdmin()) {
      this.project.listTrue().subscribe(
        (res) => {
          this.projects = res.projects;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.project.listTrueScrum().subscribe(
        (res) => {
          this.projects = res.projects;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }


  saveTeam() {
    if(!this.registerTeam.name && !this.registerTeam.projectId){  
      this.message = 'Imcomplete Data'
      this.closeAlert();
    } else {
      console.log('datos team', this.registerTeam);
      this.team.add(this.registerTeam).subscribe(
        (res) => {
          console.log(res);
          const objBoard = {
            team: res.teamResult.name,
            project: res.teamResult.projectId.name,
            idTeam: res.teamResult._id,
            idProject: res.teamResult.projectId._id
          };
          this.teamProject.push(objBoard)          
          this.registerTeam = {};
          this.message = 'Team add successful';
          this.closeAlert();

          // agreagar al scrum al team
          const objDetail = {
            teamId: objBoard.idTeam,
            userId: this.auth.idUser()
          }  
          this.adduserTeam(objDetail);
        },
        (err) => {
          console.log(err.error);
          this.message = err.error;
          this.closeAlert();
        }
      );
    }
  }

  saveSprint() {
    if (!this.registerTeam.name && !this.registerTeam.description) {
      this.message = 'Imcomplete Data';
      this.closeAlert();
    } else {
      this.registerTeam.teamId = localStorage.getItem('team');
      this.board.addBoard(this.registerTeam).subscribe(
        (res) => {
          this.sprints.push(res.result);
          this.registerTeam = {};
          this.message = 'Team add successful';
          this.closeAlert();
        },
        (err) => {
          console.log(err.error);
          this.message = err.error;
          this.closeAlert();
        }
      );
    }
  }

  adduserTeam(objDetail: any) {
    this.team.addDetail(objDetail).subscribe(
      (res)=>{
        console.log(res)
      },
      (err)=>{
        console.log(err)
      }
    )
  }
  
  deleteTeam(team: any) {
    const resultado = window.confirm(
      `Do you want to delete the ${team.team}?`
    );
    if (resultado === true) {
      
      this.team.delete(team.idTeam).subscribe(
        (res)=>{
          console.log("aqui lo que borro 1",res)
        },
        (err)=>{
          console.log(err.result)
        }
      )

      // recorremos board y obtenemos los id para luego borrarlos
      this.board.getManyBoard(team.idTeam).subscribe(
        (res)=>{
          console.log("boardssssssss:",res.boards)
          let listBoard = res.boards;
          listBoard.forEach((element:any) => {
            this.deleteSprint(element, false);
          });
        },
        (err)=>{
          console.log(err.error)
        }
      )
      
      const index = this.teamProject.indexOf(team); 
      if (index > -1){
        this.teamProject.splice(index, 1)
      } 
      this.sprints = [];
    }

  }

  deleteSprint(sprint: any, mensaje: boolean){
    
    let resultado = true;
    if(mensaje){
        resultado = window.confirm(
        `Do you want to delete the ${sprint.name}?`
        );      
    }

    if (resultado === true) {      
      this.team.deleteBoard(sprint._id).subscribe(
        (res)=>{
          console.log("primero se eliminar el board",res)
        },
        (err)=>{
          console.log(err.error)
        }
      )

      // recorremos task y obtenemos los id, para luego borrarlos
      
      this.taskService.getManyTask(sprint._id).subscribe(
        (res)=>{
          console.log("trae los id de las task del board", res.tasks)
          let listTask = res.tasks;
          listTask.forEach((element:any)=>{
            this.taskService.deleteTask(element._id).subscribe(
              (res)=>{
                console.log(res.result)
              },
              (err)=>{
                console.log(err.error)
              }
            )
          })
        },
        (err)=>{
          console.log(err.error);
        }
      )

      const index = this.sprints.indexOf(sprint); 
      if (index > -1){
        this.sprints.splice(index, 1)
      } 
      this.taskToDo = [];
      this.taskDoing = [];
      this.taskTesting = [];
      this.taskDone = [];

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



  SprintF(sprint:any) {
    console.log("!111!!!!1", sprint)
    this.sprint = sprint;
    console.log("tttttttttt",this.teamInitial);
  }

  sprintEdit() {
    let board = {}
    board = {
              _id: this.sprint._id, 
              name: this.sprint.name, 
              description: this.sprint.description, 
              teamId: this.sprint.teamId,
              status: this.sprint.status, 
              active: this.sprint.active,
            };
    this.board.update(board).subscribe(
      (res) => {
        console.log(res.board);
      },
      (err) => {
        console.log(err.error);
      }
            ); 
  }

  getTask(taskId: any) {
    // this.router.navigate(['saveTask', taskId]);
    document.getElementById('btn-close-modal')?.click();
    console.log(taskId);
    document.getElementById('task-window')?.click();
    
  }

  deleteLocalInfo() {
    // localStorage.removeItem('task')
  }

  updateTask(task: any, status: String) {
    const tempStatus = task.status;
    task.status = status;
    this.taskService.updateTask(task).subscribe(
      (res) => {
        task.status = status;
        this.updateBoard(task, res.task);
      },
      (err) => {
        task.status = tempStatus;
        this.message = err.error;
        this.closeAlert();
      }
    );
  }

  updateBoard(task: any, res: any) {
    if(res.status === 'to-do') {
      const index = this.taskToDo.indexOf(task);
      if (index > -1) this.taskToDo.splice(index, 1);
    } else if(res.status === 'doing') {
      const index = this.taskDoing.indexOf(task);
      if (index > -1) this.taskDoing.splice(index, 1);
    } else if(res.status === 'testing') {
      const index = this.taskTesting.indexOf(task);
      if (index > -1) this.taskTesting.splice(index, 1);
    } else {
      const index = this.taskDone.indexOf(task);
      if (index > -1) this.taskDone.splice(index, 1);
    }
    if(task.status === 'to-do') this.taskToDo.unshift(res);
    if(task.status === 'doing') this.taskDoing.unshift(res);
    if(task.status === 'testing') this.taskTesting.unshift(res);
    if(task.status === 'done') this.taskDone.unshift(res);
  }

  showDataTask(task: any) {
    this.detaTask = task;
    localStorage.setItem('task', task._id)
    this.taskService.getUsersTask(task._id).subscribe(
      (res) => {
        this.detaTask.users = res.users;   
        console.log(this.detaTask.users);
             
      },
      (err) => {
        console.log(err.error);
      }
    )
  }

}
