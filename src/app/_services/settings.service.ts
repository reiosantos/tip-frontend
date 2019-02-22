import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';
import 'rxjs/add/operator/map';

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) {}

    public update_settings(settings, user_id, token): Observable<any> {
        const params = {
            settings: settings,
            user_id: user_id,
            token: token
        };
        return this.http.post<any>(environment.api + 'settings/update/', params);
    }

    public fetch_settings(user_id, token): Observable<any> {
        return this.http.get<any>(environment.api + 'settings/fetch/' + user_id + '/' + token + '/');
    }
}
