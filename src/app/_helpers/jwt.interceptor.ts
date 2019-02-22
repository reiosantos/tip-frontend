import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';
import {User} from '../_models/user';
import 'rxjs/add/operator/do';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// add authorization header with TIP token if available
		const currentUser: User = JSON.parse(localStorage.getItem(environment.userStorageKey));
		const currentToken = localStorage.getItem(environment.tokenKey);
		if (currentUser && currentUser.id) {
			request = request.clone({
				setHeaders: {
					'Authorization': `Bearer ${currentToken}`,
					'Content-Type' : `application/json`,
					'Accept': `application/json`
				}
			});
		}

		return next.handle(request).do((event: HttpEvent<any>) => {

			if (event instanceof HttpResponse) {
				if (event.body && event.body.token) {
					localStorage.setItem(environment.tokenKey, event.body.token);
				}
				if (event.body.data && event.body.data === 'already logged in') {
					const user: User = JSON.parse(event.body.user);
					localStorage.setItem(environment.userStorageKey, JSON.stringify(user));
					location.assign('/dashboard');
				}
			}
		}, (err: any) => {
			if (err instanceof HttpErrorResponse) {
				if (err.status === 401) {
					localStorage.clear();
					location.assign('/login');
					location.reload();
				}
			}
		});
	}
}
