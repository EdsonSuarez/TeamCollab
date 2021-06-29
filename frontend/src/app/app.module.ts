import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';

import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { BoardService } from "./services/board.service";
import { AuthGuard } from "./guard/auth.guard";
import { AdminService } from "./services/admin.service";

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
import { ListProjectComponent } from './project/list/listProject.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { MatListModule } from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';
import { ListProjectAdminComponent } from "./admin/list-project-admin/list-project-admin.component";
import { UpdateProjectAdminComponent } from "./admin/update-project-admin/update-project-admin.component";
import { ListBoardAdminComponent } from './admin/list-board-admin/list-board-admin.component';
import { UpdateBoardAdminComponent } from './admin/update-board-admin/update-board-admin.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    ListProjectComponent,    
    ListBoardComponent,
    ListUserComponent,
    ListRoleComponent,
    RegisterRoleComponent, 
    RegisterUserComponent,  
    UpdateUserComponent, 
    UpdateRoleComponent,
    ListProjectAdminComponent,
    UpdateProjectAdminComponent,
    ListBoardAdminComponent,
    UpdateBoardAdminComponent,
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
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
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
})
export class AppModule {}
