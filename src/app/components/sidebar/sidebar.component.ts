import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Analysis',  icon: 'fa-dashboard', class: '' },
    { path: 'users', title: 'System-Users', icon: 'fa-users', class: '' },
    { path: 'logs', title: 'Logs', icon: 'fa-archive', class: '' },
    { path: 'reports', title: 'Reports', icon: 'fa-newspaper-o', class: ''},
    { path: 'notifications', title: 'Notifications',  icon: 'fa-bell-o', class: '' },
    { path: 'settings', title: 'Settings', icon: 'fa-gears', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.isMobileMenu();
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
