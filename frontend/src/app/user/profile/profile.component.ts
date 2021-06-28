import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public errorMessage: String;

  constructor() {
    this.profileData = {};
    this.errorMessage = '';
  }

  ngOnInit(): void {}

  save() {}

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000);
  }

  closeX() {
    this.errorMessage = '';
  }
}
