import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(environment.api + 'authenticate/login/',
            { username: username, password: password}, )
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.data) {
                    try {
                        const data = JSON.parse(user.data);
                        if (data.id) {
                            localStorage.setItem(environment.userStorageKey, JSON.stringify(data));
                        }
                    }catch (e) {}
                }
                if (user && user.token ) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(environment.tokenKey, user.token);
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        const  token = localStorage.getItem(environment.tokenKey);
        const userId = JSON.parse(localStorage.getItem(environment.userStorageKey));
        if (userId === null) {
            alert('Cannot continue with request, Already logged out');
            return null;
        }
        return this.http.get<any>(environment.api + 'authenticate/logout/' + userId.id + '/' + token + '/' );
    }
}
