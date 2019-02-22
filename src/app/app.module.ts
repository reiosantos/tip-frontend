import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import {FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TableListComponent } from './table-list/table-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UsersComponent } from './users/users.component';
import { LogsComponent } from './logs/logs.component';
import { ReportsComponent } from './reports/reports.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RegisteredUsersService} from './_services/registered-users.service';
import {ReportService} from './_services/report.service';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import { AlertComponent } from './_directives/alert/alert.component';
import {AuthGuard} from './_guards/auth.guard';
import {AlertService} from './_services/alert.service';
import {AuthenticationService} from './_services/authentication.service';
import {LogService} from './_services/log.service';
import {NotificationService} from './_services/notification.service';
import {SharedService} from './_services/shared.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {SettingsService} from './_services/settings.service';
import {UserService} from './_services/user.service';
import {SettingsComponent} from './settings/settings.component';
import {ChartModule} from 'angular-highcharts';
import {GraphService} from './_services/graph.service';
import {PlotsService} from './_services/plots.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableListComponent,
    NotificationsComponent,
    UsersComponent,
    LogsComponent,
    ReportsComponent,
    AlertComponent,
    UserProfileComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ChartModule
  ],
  providers: [
      AuthGuard,
      AlertService,
      AuthenticationService,
      RegisteredUsersService,
      LogService,
      NotificationService,
      SharedService,
      ReportService,
      SettingsService,
      UserService,
      GraphService,
      PlotsService,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
