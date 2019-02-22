import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {RegisteredUsersService} from '../_services/registered-users.service';
import {ReportService} from '../_services/report.service';
import {Location} from '@angular/common';
import {environment} from '../../environments/environment.prod';
import {User} from '../_models/user';
import {Feed} from '../_models/feed';
import {AlertService} from '../_services/alert.service';
import {DomainFeed} from '../_models/domain-feed';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {


    warningResources: any = [];
    warningResources1: any = {};
    blockedResources: any = [];
    blockedResources1: any = {};
    warningNetworkResources: any = [];
    warningNetworkResources1: any = {};
    blockedNetworkResources: any = [];
    blockedNetworkResources1: any = {};
    redirectedDomains: any = [];
    whiteListedDomains: any = [];
    ipData: Feed = new Feed();
    user: User;
    loading = false;
    navIsFixed: boolean;

    constructor(
        private registeredUsersService: RegisteredUsersService,
        private location: Location,
        private reportService: ReportService,
        private alertService: AlertService,
        @Inject(DOCUMENT) private document: Document
    ) {
        if (localStorage.getItem(environment.userStorageKey) !== null) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
        // this.ipData = new IpData();

    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop > 100) {
            this.navIsFixed = true;
        } else if (this.navIsFixed && window.pageYOffset ||
            this.document.documentElement.scrollTop || this.document.body.scrollTop < 10
        ) {
            this.navIsFixed = false;
        }
    }

    scrollToTop() {
        (function smoothScroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothScroll);
                window.scrollTo(0, currentScroll - (currentScroll / 5));
            }
        })();
    }

    ngOnInit() {
        if (this.user !== null) {
            this.reload();
        }
    }

    getNetworkResources(): void {
        this.registeredUsersService.getNetworkResources().subscribe(data => {
            if (data.token) {
                localStorage.setItem(environment.tokenKey, data.token);
            }
        });
    }

    /**
     * Section for resources categorized by valid ip
     */

    getWarningResources(): void {
        this.registeredUsersService.getWarningResources(this.user.id)
            .subscribe(data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    const feeds: Feed[] = JSON.parse(data.data);
                    this.warningResources = [];
                    this.warningResources1 = {};

                    for (const record of feeds){
                        if (!this.warningResources1.hasOwnProperty(record.source_network)) {
                            this.warningResources1[
                                record.source_network
                                    .replace('/', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                    .replace('.', '_') + '_'
                                ] = [];
                        }
                        this.warningResources.push(
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_') + '_'
                        );
                        this.warningResources1[
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_') + '_'
                            ].push(record);
                    }
                }else {
                    this.alertService.error(data.error);
                }
            });
    }

    getBlockedResources(): void {
        this.registeredUsersService.getBlockedResources(this.user.id)
            .subscribe(data => {
                this.loading = false;
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    const feeds: Feed[] = JSON.parse(data.data);

                    this.blockedResources = {};
                    this.blockedResources = [];

                    for (const record of feeds){
                        if (!this.blockedResources1.hasOwnProperty(record.source_network)) {
                            this.blockedResources1[
                                record.source_network
                                    .replace('/', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                ] = [];
                        }
                        this.blockedResources.push(
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                        );
                        this.blockedResources1[
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                            ].push(record);
                    }
                }else {
                    this.alertService.error(data.error);
                }
            }, error => this.loading = false );
    }

    /**
     * Section for resources categorized by network
     */

    getBlockedNetworkResources(): void {
        this.registeredUsersService.getBlockedNetworkResources(this.user.id)
            .subscribe(data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    const feeds: Feed[] = JSON.parse(data.data);

                    this.blockedNetworkResources1 = {};
                    this.blockedNetworkResources = [];

                    for (const record of feeds){
                        if (!this.blockedNetworkResources1.hasOwnProperty(record.source_network)) {
                            this.blockedNetworkResources1[
                                record.source_network
                                    .replace('/', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                ] = [];
                        }
                        this.blockedNetworkResources.push(
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                        );
                        this.blockedNetworkResources1[
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                            ].push(record);
                    }
                }else {
                    this.alertService.error(data.error);
                }
                // this.getNetworkResources();
            });
    }

    getWarningNetworkResources(): void {
        this.registeredUsersService.getWarningNetworkResources(this.user.id)
            .subscribe(data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    const feeds: Feed[] = JSON.parse(data.data);

                    this.warningNetworkResources1 = {};
                    this.warningNetworkResources = [];

                    for (const record of feeds){
                        if (!this.warningNetworkResources1.hasOwnProperty(record.source_network)) {
                            this.warningNetworkResources1[
                                record.source_network
                                    .replace('/', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                    .replace('.', '_')
                                ] = [];
                        }
                        this.warningNetworkResources.push(
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                        );
                        this.warningNetworkResources1[
                            record.source_network
                                .replace('/', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                                .replace('.', '_')
                            ].push(record);
                    }
                }else {
                    this.alertService.error(data.error);
                }
            });
    }

    /**
     * Section for resources categorized Domain Names
     */
    getDomains(): void {
        this.registeredUsersService.getDomains(this.user.id)
            .subscribe(data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    const domainFeed: DomainFeed[] = JSON.parse(data.data);
                    for (const record of domainFeed) {
                        if (record.redirected === true) {
                            this.redirectedDomains.push(record);
                        }else if (record.redirected === false) {
                            this.whiteListedDomains.push(record);
                        }
                    }
                }else {
                    this.alertService.error(data.error);
                }
            });
    }



    reformatAddress(addr) {
        addr = addr.replace('_', '.')
            .replace('_', '.')
            .replace('_', '.')
            .replace('_', '/')
            .replace('_', '');
        return addr;
    }


    ipAddressData(feed: Feed) {
        this.ipData = feed;
    }

    unBlockNetwork($event, network) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.unBlockNetwork(this.user.id, token, network).subscribe(
            () => {
                this.reload();
            }
        );
    }

    blockNetwork($event, network) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.blockNetwork(this.user.id, token, network).subscribe(
            () => {
                this.reload();
            }
        );
    }

    unBlockIP($event, res: Feed) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.unBlockIp(this.user.id, token, res.source_ip, res.source_network).subscribe(
            () => {
                this.reload();
            }
        );
    }

    blockIp($event, ipResource: Feed) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.blockIp(this.user.id, token, ipResource).subscribe(
            (data) => {
                this.reload();
            }
        );
    }

    whiteList($event, blackListedDomain) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.whiteList(this.user.id, token, blackListedDomain).subscribe(
            () => {
                this.reload();
            }
        );
    }

    blackListDomain($event, whiteListedDomain) {
        $event.preventDefault();
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.reportService.blackListDomain(this.user.id, token, whiteListedDomain).subscribe(
            () => {
                this.reload();
            }
        );
    }

    reload(): void {
        this.loading = true;
        this.getBlockedResources();
        this.getWarningResources();
        this.getBlockedNetworkResources();
        this.getWarningNetworkResources();
        this.getDomains();
    }


    // on button click scroll to the top



}
