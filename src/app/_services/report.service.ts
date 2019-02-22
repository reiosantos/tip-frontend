import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';
import 'rxjs/add/operator/map';
import {Feed} from '../_models/feed';

@Injectable()
export class ReportService {
    private reportUnblockUrl = 'analysis/unblock/network/';
    private reportBlockUrl = 'analysis/block/network/';
    private reportUnblockIpUrl = 'analysis/unblock/ip/';
    private reportBlockIpUrl = 'analysis/block/ip/';
    private reportWhiteList = 'domains/redirect/remove/';
    private  reportBlackList = 'domains/redirect';

    constructor(private http: HttpClient) {
    }

    unBlockNetwork(userid, token, network): Observable<any> {
        const params = {
            network: network,
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportUnblockUrl, params);
    }

    unBlockIp(userid, token, ip, network): Observable<any> {
        const params = {
            data: {
                network: network,
                ip: ip,
            },
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportUnblockIpUrl, params);
    }

    blockNetwork(userid, token, network): Observable<any> {
        const params = {
            network: network,
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportBlockUrl, params);
    }

    blockIp(userid, token, ipResource: Feed): Observable<any> {
        const params = {
            data: {
                network: ipResource.source_network,
                ip: ipResource.source_ip,
            },
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportBlockIpUrl, params);
    }

    whiteList(userid, token, blackListedDomain): Observable<any> {
        const params = {
            domain: blackListedDomain,
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportWhiteList, params);
    }

    blackListDomain(userid, token, whiteListedDomain): Observable<any> {
        const params = {
            domain: whiteListedDomain,
            user_id: userid,
            token: token
        };
        return this.http.post<any>(environment.api + this.reportBlackList, params);
    }

}
