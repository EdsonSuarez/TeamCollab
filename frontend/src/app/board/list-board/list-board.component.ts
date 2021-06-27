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

  constructor(private board: BoardService, private router: Router) { 
    this.toggle = true;    
    this.taskToDo = [];
    this.taskDoing = [];
    this.taskTesting = [];
    this.taskDone = [];
  }

  ngOnInit(): void {
    this.board.boardUser().subscribe(
      (res)=>{
        console.log(res.tasksUser)        
        const data = res.tasksUser;
        data.forEach((task: any) => {  
          switch (task.taskId.status) {
            case "to-do":
              this.taskToDo.push(task.taskId)
              break;
            case "doing":
              this.taskDoing.push(task.taskId)
              break;
            case "testing":
              this.taskTesting.push(task.taskId)
              break;
            case "done":
              this.taskDone.push(task.taskId)
              break;          
            default:
              break;
          }
        });         
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  cambio(){
  this.toggle = !this.toggle;
  console.log("toggle", this.toggle)
  }

}
