import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GraphService {

  private url = environment.api + 'analysis/fetch/plots';

    constructor(private http: HttpClient) { }

    graphs(user_id: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenKey);
        return this.http.get<any>( this.url + '/' + user_id + '/' + token + '/');
    }
}
