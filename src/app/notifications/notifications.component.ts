import { Component, OnInit } from '@angular/core';
import {Feed} from '../_models/feed';
import {NotificationService} from '../_services/notification.service';
import {User} from '../_models/user';
import {environment} from '../../environments/environment.prod';
import {isBoolean, isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import {SharedService} from '../_services/shared.service';
declare var $: any;
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    lFeeds: Feed[] = [];
    gFeeds: Feed[] = [];
    user: User;
    localFeed: any;
    globalFeed: any;

    modalFeed: Feed = new Feed();

    constructor(
        private notificationService: NotificationService,
        private sharedService: SharedService
    ) {
        if (localStorage.getItem(environment.userStorageKey) !== null) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
    }
    ngOnInit() {
        this.globalNetworkNotification();
    }

    localNetworkNotification(num: number) {
        this.notificationService.localNotification(this.user.id).subscribe(
            data => {
                if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
                    const fd = JSON.parse(data.data);
                    for (let i = 0; i < fd.length; i++) {
                        this.lFeeds.push(fd[i]);
                    }
                }
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                const g = [];
                g[0] = this.lFeeds.slice(0, 4).length > 0 ? this.lFeeds.slice(0, 4) : this.gFeeds.slice(0, 4);
                g[1] =  this.lFeeds.length + num;
                this.sharedService.emitChange(g);
                this.globalFeeds();
            }
        );
    }

    globalNetworkNotification() {
        this.notificationService.globalNotification(this.user.id).subscribe(
            data => {
                if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
                    // this.gFeeds = JSON.parse(data.data);
                    const fd = JSON.parse(data.data);
                    for (let i = 0; i < fd.length; i++) {
                        this.gFeeds.push(fd[i]);
                    }
                }
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                const g = [];
                g[0] = this.gFeeds.slice(0, 4);
                g[1] =  this.gFeeds.length;
                this.sharedService.emitChange(g);

                this.localNetworkNotification(this.gFeeds.length);
            }
        );
    }

    globalFeeds(): void {
        this.globalFeed = Observable.timer(300000).first().subscribe(() => this.globalNetworkNotification());
    }

    displayInfo(feed: Feed) {
        this.modalFeed = feed;
    }
}
