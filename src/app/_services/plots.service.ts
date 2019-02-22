import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class PlotsService {

	constructor(private http: HttpClient) {
	}

	getPlots(user_id, token) {
		return this.http.get<any>(environment.api + 'analysis/fetch/plots/' + user_id + '/' + token + '/');
	}
}
