import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public profile: any;
  public photo: Boolean;

  constructor(public auth: AuthService) {
    this.profile = {};
    this.photo = false;
  }

  ngOnInit(): void {
    this.headProf();
  }

  headProf() {
    this.profile = this.auth.profile();
    if (this.profile.photo) this.photo = true;
  }
}
