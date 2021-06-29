import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-board-admin',
  templateUrl: './list-board-admin.component.html',
  styleUrls: ['./list-board-admin.component.css']
})
export class ListBoardAdminComponent implements OnInit {

  public idTeam: String;
  public boards: any;
  public tasks: any;

  constructor( private admin: AdminService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.boards = {};
    this.tasks = {};
    this.idTeam = '';
    this.activatedRoute.params.subscribe((params: any) => {
      this.idTeam = params.id;
    });
  }

  ngOnInit(): void {
    this.admin.getBoardsByTeam(this.idTeam).subscribe(
      (res)=>{
        console.log(res);
        this.boards = res.boards;
      },
      (err)=>{
        console.log(err.error)
      }
    )
  }

  changeBoard(board: any){
    this.admin.getTasksByBoard(board._id).subscribe(
      (res)=>{
        console.log(res);
        this.tasks = res.tasks;
      },
      (err)=>{
        console.log(err.error)

      }
    )
  }

}
