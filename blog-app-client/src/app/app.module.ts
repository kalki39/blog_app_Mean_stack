import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApicallService } from './service/apicall.service';
import { ShapeComponent } from './component/shape/shape.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomeComponent } from './component/home/home.component';
import { CommonModule } from '@angular/common';
import { ClickBoardComponent } from './component/click-board/click-board.component';
import { ChartComponent } from './component/chart/chart.component';
import { AuthGuardService } from './service/auth-guard.service';
import { CreateBlogComponent } from './component/create-blog/create-blog.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ShapeComponent,
    HomeComponent,
    ClickBoardComponent,
    ChartComponent,
    CreateBlogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ApicallService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {}
