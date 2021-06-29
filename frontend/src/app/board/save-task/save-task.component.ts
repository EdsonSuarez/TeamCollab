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

  public teamProject: any;

  constructor(private task: TaskService, private team:TeamService, private router: Router) { 
    this.taskData = {};
    this.errorMessage = '';
    this.teamProject = [];

    this.fileControl = new FormControl()
  }

  ngOnInit(): void {
  }

  saveTask(){
    if (!this.taskData.name || !this.taskData.description) {
      console.log('Failed process: Incomplete data');
      this.errorMessage = 'Failed process: Incomplete data';
      this.closeAlert(3000);
    } else {
      this.task.saveTask(this.taskData).subscribe(
        (res: any) => {
          console.log(res);
          this.router.navigate(['/listTasks']);
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
