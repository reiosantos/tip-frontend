import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RegisteredUsers} from '../Classes/registered-users';
import {Observable} from 'rxjs/Observable';
import {NetworkResources} from '../Classes/network-resources';
import {NetworkResourcesWarning} from '../Classes/network-resources-warning';
import {environment} from '../../environments/environment.prod';
import {Feed} from '../_models/feed';

@Injectable()
export class RegisteredUsersService {
    private registeredUsersUrl = 'user/fetch/all/';
    // private resourceUrl = 'analysis/block/address/';
    private resourceUrl = 'authenticate/login/';
    private warningUrl = 'analysis/block/address/';

  constructor(
      private http: HttpClient
  ) { }

    getRegisteredUsers(): Observable<any> {
      const df = JSON.parse(localStorage.getItem(environment.userStorageKey)).id;
        const params1 = new HttpParams();
        params1.set('user_id', df);
        params1.append('token', localStorage.getItem(environment.tokenKey));
        return this.http.get<any>(environment.api + this.registeredUsersUrl, {params: params1});
    }

    getNetworkResources(): Observable<any> {
      const params1 = {
          'username': 'arnold',
          'password': 'arnold',
      };
      return this.http.post<any>(environment.api + this.resourceUrl, params1);
    }

    getBlockedResources(userId: any): Observable<any> {
      const token = localStorage.getItem(environment.tokenKey);
      return this.http.get<any>(environment.api + 'analysis/fetch/blocked/ip/' + userId + '/' + token + '/');
    }

    getWarningResources(userId: any): Observable<any> {
      const token = localStorage.getItem(environment.tokenKey);
      return this.http.get<any>(environment.api + 'analysis/fetch/unblocked/ip/' + userId + '/' + token + '/');
    }

    getBlockedNetworkResources(userId: any): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>(environment.api + 'analysis/fetch/blocked/network/' + userId + '/' + token + '/');
    }

    getWarningNetworkResources(userId: any): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>(environment.api + 'analysis/fetch/unblocked/network/' + userId + '/' + token + '/');
    }

    getDomains(userId: any): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>(environment.api + 'domains/fetch/' + userId + '/' + token + '/');
    }

    // getIpData(ip: string): Observable<> {}



}
