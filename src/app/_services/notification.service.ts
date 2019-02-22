import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class NotificationService {
    private url = environment.api + 'analysis/notifications/fetch/';

    constructor(private http: HttpClient) { }

    globalNotification(user_id: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>( this.url + 'global/' + user_id + '/' + token + '/');
    }

    localNotification(user_id: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>( this.url + 'local/' + user_id + '/' + token + '/');
    }

}
