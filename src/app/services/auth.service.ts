import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public books = [];
    public users: any;
    constructor(private httpClient: HttpClient) { }


    login(login: any, senha: any): Observable<any> {
     
        const headers = new HttpHeaders().set('Content-type', 'application/json');
        return this.httpClient.post(environment.AUTH_SERVER_ADDRESS + '/vendedor/autenticar', {
            login: login,
            senha: senha
        },
            { headers: headers }
        );
    }

}