import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from "./home/home/home.component";
import { ListProjectComponent } from './project/list/listProject.component';
import { ListBoardComponent } from "./board/list-board/list-board.component";
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'project',
    component: ListProjectComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'board',
    component: ListBoardComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
