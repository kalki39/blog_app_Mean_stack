import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ShapeComponent } from './component/shape/shape.component';
import { HomeComponent } from './component/home/home.component';
import { ClickBoardComponent } from './component/click-board/click-board.component';
import { ChartComponent } from './component/chart/chart.component';
import { CanActivate, Router } from '@angular/router';
import { AuthGuardService } from './service/auth-guard.service';
import { CreateBlogComponent } from './component/create-blog/create-blog.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateBlogComponent },
  { path: 'uber', component: ShapeComponent },
  { path: 'click', component: ClickBoardComponent },
  { path: 'chart', component: ChartComponent, canActivate: [AuthGuardService] },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
