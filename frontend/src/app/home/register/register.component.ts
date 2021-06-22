import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerData: any;
  public errorMessage: String;

  constructor(private router: Router, private auth: AuthService) {
    this.registerData = {},
    this.errorMessage = '';
  }

  ngOnInit(): void {
  }

  register(){
    if (!this.registerData.fullName || !this.registerData.email || !this.registerData.password) {
      console.log("Failed process: Incomplete data")
      this.errorMessage = 'Failed process: Incomplete data';
      this.closeAlert();    
  } else {
      this.auth.registerUser(this.registerData).subscribe(
        (res: any)=>{
          console.log(res);
          localStorage.setItem('token', res.jwtToken);
          this.registerData = {};
          // this.router.navigate(['/saveTask']);                  
        },
        (err) =>{
          console.log(err);
          this.errorMessage = err.error;
          this.closeAlert();
          this.registerData = {};
        }
      );
  }
  }

  closeAlert(){
    setTimeout(()=>{      
      this.errorMessage = ''
    }, 3000)
  }

  xAlert(){        
    this.errorMessage = ''  
  }

}