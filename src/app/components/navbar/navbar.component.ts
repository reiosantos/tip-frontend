import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AuthenticationService} from '../../_services/authentication.service';
import {environment} from '../../../environments/environment.prod';
import {Feed} from '../../_models/feed';
import {SharedService} from '../../_services/shared.service';
import {User} from '../../_models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;
    notifications: Feed[] = [];
    notificationCount = 0;
    user: User;

    constructor(location: Location,
                private authService: AuthenticationService,
                private sharedService: SharedService,
                private element: ElementRef) {

        if (localStorage.getItem(environment.userStorageKey)) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
      this.location = location;
      this.sidebarVisible = false;
      this.sharedService.changeEmitted$.subscribe(
          (feeds) => {
              if (feeds && feeds.length > 0) {
                  this.notifications = feeds[0];
                  this.notificationCount = feeds[1];
              }
          }
      );
    }

    ngOnInit() {
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle() {
      let titlee = this.location.prepareExternalUrl(this.location.path());
      if (titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for (let item = 0; item < this.listTitles.length; item++){
          if (this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'User-Profile';
    }

    logout() {

        const sub = this.authService.logout();
        if (sub !== null) {
            sub.subscribe(
                data => {
                if (data && data.data) {
                    localStorage.removeItem(environment.userStorageKey);
                    localStorage.clear();
                    location.reload();
                } else {
                    alert('could not log you out of the application...' + data.error);
                }
            }, error2 => {
                    if (error2.status === 401 ) {
                        const err = JSON.parse(error2.error)
                    }else {
                        alert('could not log you out of the application.. It could be a network issue...');
                    }
            });
        }


    }
}
