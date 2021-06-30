import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../services/task.service";
import { TeamService } from "../../services/team.service";
import { Router } from "@angular/router";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.css']
})
export class SaveTaskComponent implements OnInit {

  public taskData: any;
  public errorMessage: String;
  public selectedFile: any;

  public teamMembers: any;
  public teamTasks: any;

  // File variables
  fileControl: FormControl;
  public file: any;

  constructor(private task: TaskService, private team:TeamService, private router: Router, public dialog: MatDialog) { 
    this.taskData = {};
    this.errorMessage = '';
    this.teamMembers = [];
    this.teamTasks = [];

    // File variables
    this.fileControl = new FormControl(this.file)
    this.fileControl = new FormControl()
    this.selectedFile = null;
    this.file = null;
  }

  ngOnInit(): void {
    

    const teamId = localStorage.getItem('team');
    const boardId = localStorage.getItem('sprint');
    this.taskData.boardId = boardId;
    console.log(teamId)
    this.task.getTeam(teamId).subscribe(
      (res) => {
        console.log(res.team)
        this.teamMembers = res.team;
      },
      (err) => {
        console.log(err.error);
      }
    )
    this.task.getTasks().subscribe(
      (res) => {
        this.teamTasks = res.userTask
        console.log(this.teamTasks)
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

  saveTaskImg(){
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
        data.append('dependency', this.taskData.dependency);
        console.log(data)
        console.log(this.taskData.dependency);
        
        this.task.saveTaskImg(data).subscribe(
          (res) => {
            console.log(res);
            this.router.navigate(['/board/inicio'])
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
            console.log(res);
            console.log(this.taskData.dependency);
            
            this.router.navigate(['/board/inicio']);
            this.taskData = {};
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

  closeAlert(time: number) {
    setTimeout(() => {this.errorMessage = '' }, time)
  }

}
