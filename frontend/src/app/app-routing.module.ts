import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from "./home/home/home.component";
import { ListProjectComponent } from './project/list/listProject.component';
import { ListBoardComponent } from "./board/list-board/list-board.component";
import { AuthGuard } from './guard/auth.guard';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';
import { ListProjectAdminComponent } from "./admin/list-project-admin/list-project-admin.component";
import { UpdateProjectAdminComponent } from "./admin/update-project-admin/update-project-admin.component";
import { ListBoardAdminComponent } from "./admin/list-board-admin/list-board-admin.component";
import { UpdateBoardAdminComponent } from "./admin/update-board-admin/update-board-admin.component";


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
    path: 'listProjectAdmin',
    component: ListProjectAdminComponent,
    canActivate: [AuthGuard],    
  },
  {
    path: 'updateProjectAdmin',
    component: UpdateProjectAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listBoard/:id',
    component: ListBoardAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateBoard/:id',
    component: UpdateBoardAdminComponent,
    canActivate: [AuthGuard],
  },  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
