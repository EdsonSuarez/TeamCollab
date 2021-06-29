import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';

import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { BoardService } from './services/board.service';
import { AuthGuard } from './guard/auth.guard';
import { AdminService } from './services/admin.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home/home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamComponent } from './team/team/team.component';
import { DetailTeamComponent } from './team/detail-team/detail-team.component';
import { DetailTaskComponent } from './task/detail-task/detail-task.component';
import { TaskComponent } from './task/task/task.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './user/profile/profile.component';
import { ListProjectComponent } from './project/list/listProject.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';
import { UpdateProfileComponent } from './user/update-profile/update-profile.component';
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    TeamComponent,
    DetailTeamComponent,
    DetailTaskComponent,
    TaskComponent,
    ProfileComponent,
    ListProjectComponent,
    ListBoardComponent,
    ListUserComponent,
    ListRoleComponent,
    RegisterRoleComponent,
    RegisterUserComponent,
    UpdateUserComponent,
    UpdateRoleComponent,
    UpdateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  providers: [
    AuthService,
    BoardService,
    AdminService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [UpdateProfileComponent],
})
export class AppModule {}
