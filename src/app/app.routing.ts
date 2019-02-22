import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TableListComponent } from './table-list/table-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {UsersComponent} from './users/users.component';
import {LogsComponent} from './logs/logs.component';
import {ReportsComponent} from './reports/reports.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './_guards/auth.guard';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {SettingsComponent} from './settings/settings.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]},
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    { path: 'logs', component: LogsComponent, canActivate: [AuthGuard]},
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'table-list',     component: TableListComponent, canActivate: [AuthGuard]},
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
    { path: '**',               redirectTo: 'dashboard', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
