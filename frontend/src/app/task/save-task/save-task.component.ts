import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../services/task.service";
import { TeamService } from "../../services/team.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.css']
})
export class SaveTaskComponent implements OnInit {

  public taskData: any;
  public successMessage: String;
  public errorMessage: String;
  
  public successMessageUser: String;
  public errorMessageUser: String;

  public selectedFile: any;

  public teamMembers: any;
  public teamTasks: any;
  public UserSelect: any;
  public userTemp: any;
  // public flagTask: boolean;
  public flagImage: boolean;
  public flagEditTask: boolean;
  public teamId: any;
  public boardId: any;
  public projectId: any;
  public taskId: any;

  // File variables
  fileControl: FormControl;
  public file: any;

  public idTask: String;

  constructor(private task: TaskService, private team:TeamService, private router: Router, private activatedRoute: ActivatedRoute, public auth: AuthService,) { 
    this.taskData = {};
    this.successMessage = '';
    this.errorMessage = '';
    this.successMessageUser = '';
    this.errorMessageUser = '';
    this.teamMembers = [];
    this.teamTasks = [];
    this.UserSelect = [];
    this.userTemp = []; 
    // this.flagTask = false;
    this.flagImage = true;
    this.flagEditTask = false;

    // File variables
    this.fileControl = new FormControl(this.file)
    this.fileControl = new FormControl()
    this.selectedFile = null;
    this.file = null;

    this.idTask = '';
    this.activatedRoute.params.subscribe((params: any) => {
      this.idTask = params.id;
    });
    this.teamId = localStorage.getItem('team');
    this.boardId = localStorage.getItem('sprint');
    this.projectId = localStorage.getItem('project');
    this.taskId = localStorage.getItem('task');
  }

  ngOnInit(): void {
    // localStorage.removeItem('task')

    this.taskData = {};
    this.taskData.priority = 'Priority'
    // if(this.idTask != 'inicio'){
    //   // console.log(this.idTask);
    //   this.flagEditTask = true;
      
    //   this.flagTask = true;
    //   this.flagImage = false;
    //   this.task.getOneTask(this.idTask).subscribe(
    //     (res) => {
    //       this.taskData = res.userTask;
    //       console.log(res.userTask)
    //     },
    //     (err) => {
    //       console.log(err.error);
    //     }
    //   )
    // }
    this.taskData.boardId = this.boardId;
    this.task.getTasks().subscribe(
      (res) => {
        this.teamTasks = res.userTask
        // console.log(this.teamTasks)
      },
      (err) => {
        console.log(err.error);
      }
    )

    this.fileControl.valueChanges.subscribe((files: any) => {
      this.file = files;
    })
  }

  onDisabledChanged(value: boolean) {
    if (!value) {
      this.fileControl.enable();
    } else {
      this.fileControl.disable();
    }
  }

  // Not in use
  // uploadImg(event: any){
  //   console.log(event);
  //   this.selectedFile = <File>event.target.files[0];
  //   console.log(this.selectedFile);
  // }

  usersTeam() {
    console.log(this.flagEditTask);
    
    if (this.flagEditTask == true) {
      this.task.getUsersTask(this.taskId).subscribe(
        (res: any) => {
          console.log(res.users);
          this.teamMembers = res.users;
          
          // console.log('Deleted Task');
          
          // this.router.navigate(['/board/inicio']);
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;
          this.closeAlert(3000);
        }
      )
    }
    else {
      const teamId = localStorage.getItem('team');
      this.task.getTeam(teamId).subscribe(
        (res) => {
          console.log(res.team)
          this.teamMembers = res.team;
        },
        (err) => {
          console.log(err.error);
        }
      )
    }
  }

  saveTaskImg(){
    if (this.flagEditTask == true) {
      this.task.updateTask(this.taskData).subscribe(
        (res) => {
          console.log(res.team)
          this.successMessage = 'Task updated successfully';
              this.closeAlert(3000);
        },
        (err) => {
          console.log(err.error);
          this.errorMessage = 'Error updating Task';
              this.closeAlert(3000);
        }
      )
    } else {
      if (!this.taskData.name || !this.taskData.description || !this.taskData.boardId) {
        console.log('Failed process: Incomplete data');
        this.errorMessage = 'Failed process: Incomplete data'
        this.closeAlert(3000);  
      } else {
        const data = new FormData();
        if (this.file) {
          data.append('image', this.file, this.file.name);
          data.append('name', this.taskData.name);
          data.append('description', this.taskData.description);
          data.append('boardId', this.taskData.boardId);
          data.append('priority', this.taskData.priority);
          // data.append('dependency', this.taskData.dependency);
          console.log(data)
          // console.log(this.taskData.dependency);
          
          this.task.saveTaskImg(data).subscribe(
            (res) => {
              localStorage.setItem('task', res.result._id );
              // this.flagTask = true;
              window.location.reload();
              // this.successMessage = 'Task created successfully';
              // this.closeAlert(3000);
            },
            (err) => {
              console.log(err.error);
              this.errorMessage = err.error;
              this.closeAlert(3000);
            }
          )
        }
        else {
          this.task.saveTask(this.taskData).subscribe(
            (res: any) => {
              localStorage.setItem('task', res.result._id);
              // this.flagTask = true;
              // this.successMessage = 'Task created successfully';
              // this.closeAlert(3000);
              window.location.reload();
            },
            (err) => {
              console.log(err);
              this.errorMessage = err.error;
              this.closeAlert(3000);
            }
          )
        }
      }
    }
  }

  getAssignedUsers(){
    if (this.flagEditTask == true) {
      this.task.getUsersTask(this.taskId).subscribe(
        (res: any) => {
          console.log(res);
          // this.teamMembers = res.team;
          
          // console.log('Deleted Task');
          
          // this.router.navigate(['/board/inicio']);
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;
          this.closeAlert(3000);
        }
      )
    }
  }

  getImage() {
    // let imageUrl
    console.log(this.taskData);
    
  }
  addImage() {
    this.flagImage = true;
  }
  deleteTask(taskId: any){
    // let taskId = localStorage.getItem('team');
    // const taskId = this.idTask;
    this.task.deleteTask(taskId).subscribe(
      (res: any) => {
        console.log('Deleted Task');
        
        // this.router.navigate(['/board/inicio']);
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error;
        this.closeAlert(3000);
      }
    )
  }

  userAdd(member: any){
    let taskId = localStorage.getItem('task');
    let taskDetail = {userId: member.userId._id, taskId: taskId}

    console.log(member);
    
    this.task.addDetail(taskDetail).subscribe(
      (res: any) => {
        this.successMessageUser = `Task assigned to ${member.userId.fullName}`;
        this.closeAlert(3000);
        // this.teamMembers.member.flagAssigned = true;
        console.log(this.teamMembers);
        
      },
      (err) => {
        console.log(err);
        this.errorMessageUser = err.error;
        this.closeAlert(3000);
      }
    )
  }

  userDelete(userId: any){
    this.task.deleteDetail(userId).subscribe(
      (res: any) => {
        this.successMessageUser = 'Task unassigned';
        this.closeAlert(3000);
        
      },
      (err) => {
        console.log(err);
        this.errorMessageUser = err.error;
        this.closeAlert(3000);
      }
    )
  }

  newTask(){
    // this.flagTask = false;
    this.flagImage = true
    this.taskData = {};
    const boardId = localStorage.getItem('sprint');
    this.taskData.boardId = boardId;
  }

  closeAlert(time: number) {
    setTimeout(() => {this.errorMessage = '', this.successMessage = '', this.errorMessageUser = '', this.successMessageUser = '' }, time)
  }

}
