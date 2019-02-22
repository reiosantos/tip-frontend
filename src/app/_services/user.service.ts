import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';
import 'rxjs/add/operator/map';
import {User} from '../_models/user';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    public createUser(user: User, user_id, token): Observable<any> {
        const params = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            password_verify: user.verifyPassword,
            user_id: user_id,
            token: token
        };
        return this.http.post<any>(environment.api + 'user/add/', params);
    }

    public updateUser(user: User, user_id, token): Observable<any> {
        const params = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            password_verify: user.verifyPassword,
            update_user_id: user.id,
            user_id: user_id,
            token: token
        };
        return this.http.put<any>(environment.api + 'user/update/', params);
    }

    public fetchUsers(user_id, token): Observable<any> {
        return this.http.get<any>(environment.api + 'user/fetch/all/' + user_id + '/' + token + '/');
    }

    public activateUser(email, user_id, token): Observable<any> {
        const params = {
            email: email,
            user_id: user_id,
            token: token
        };
        return this.http.post<any>(environment.api + 'user/activate/', params);
    }

    public deactivateUser(email, user_id, token): Observable<any> {
        email = email.replace('@', '-');
        return this.http.delete<any>(environment.api + 'user/deactivate/' + email + '/' + user_id + '/' + token + '/');
    }

}
