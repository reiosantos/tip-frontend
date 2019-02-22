import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class LogService {

    constructor(private http: HttpClient) { }

    getUserLogs(user_id: any) {
    const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>(environment.api + 'logs/fetch/' + user_id + '/' + 'user' + '/' + token + '/');
    }

    deleteUserLogs(user_id: any, delete_before: any) {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.delete<any>(environment.api + 'logs/delete/'  + user_id + '/' + delete_before + '/' + 'user' + '/' + token + '/');
    }

    getSystemLogs(user_id: any) {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>(environment.api + 'logs/fetch/' + user_id + '/' + 'system' + '/' + token + '/');
    }

    deleteSystemLogs(user_id: any, delete_before: any) {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.delete<any>(environment.api + 'logs/delete/' + user_id + '/' + delete_before + '/' + 'system' + '/' + token + '/');
    }
}
