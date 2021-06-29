import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from "./home/home/home.component";
import { ListProjectComponent } from './project/list/listProject.component';
import { ListBoardComponent } from "./board/list-board/list-board.component";
import { SaveTaskComponent } from "./board/save-task/save-task.component";
import { AuthGuard } from './guard/auth.guard';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';


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
  },{
    path: 'registerUser',
    component: RegisterUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateUser/:id',
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listUsers',
    component: ListUserComponent,
    canActivate: [AuthGuard],
  },
  
  {
    path: 'listRole',
    component: ListRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registerRole',
    component: RegisterRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateRole/:id',
    component: UpdateRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'task',
    component: SaveTaskComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
