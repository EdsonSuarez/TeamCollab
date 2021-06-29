import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../services/task.service";
import { TeamService } from "../../services/team.service";
import { Router } from "@angular/router";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.css']
})
export class SaveTaskComponent implements OnInit {

  public taskData: any;
  public errorMessage: String;
  public fileControl: FormControl;

  public teamMembers: any;
  public teamTasks: any;

  constructor(private task: TaskService, private team:TeamService, private router: Router) { 
    this.taskData = {};
    this.errorMessage = '';
    this.teamMembers = [];
    this.teamTasks = [];

    this.fileControl = new FormControl()
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
  }

  saveTask(){
    if (!this.taskData.name || !this.taskData.description || !this.taskData.boardId) {
      console.log('Failed process: Incomplete data');
      this.errorMessage = 'Failed process: Incomplete data';
      this.closeAlert(3000);
    } else {
      console.log(this.taskData);
      
      this.task.saveTask(this.taskData).subscribe(
        (res: any) => {
          console.log(res);
          this.router.navigate(['/board']);
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

  closeAlert(time: number) {
    setTimeout(() => {this.errorMessage = '' }, time)
  }

}
