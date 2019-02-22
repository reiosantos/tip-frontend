import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import {AuthenticationService} from './_services/authentication.service';
import {environment} from '../environments/environment.prod';
import {User} from './_models/user';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    user: User = null;
    isLoggedin = false;

    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    constructor(
        public location: Location,
        private router: Router,
        private authService: AuthenticationService
        ) {
        if (localStorage.getItem(environment.userStorageKey) !== null) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
        this.isLoggedin = !!this.user;
       /* console.log(this.isLoggedin);
        console.log(this.user);*/

    }

    loginEmit(status) {
        this.isLoggedin = status;
        this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        if (this.user && this.isLoggedin) {
            location.reload();
        }
    }

    ngOnInit() {
        $.material.init();
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
         this.router.events.subscribe((event: any) => {
            this.navbar.sidebarClose();
            if (event instanceof NavigationStart) {
               if (event.url !== this.lastPoppedUrl) {
                   this.yScrollStack.push(window.scrollY);
               }
           } else if (event instanceof NavigationEnd) {
               if (event.url === this.lastPoppedUrl) {
                   this.lastPoppedUrl = undefined;
                   window.scrollTo(0, this.yScrollStack.pop());
               } else {
                   window.scrollTo(0, 0);
               }
           }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
             elemMainPanel.scrollTop = 0;
             elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
        }
    }
    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    runOnRouteChange(): void {
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const ps = new PerfectScrollbar(elemMainPanel);
        ps.update();
      }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
