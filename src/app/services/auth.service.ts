import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { element } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public books = [];
    public users: any;
    headers: any;
    constructor(private httpClient: HttpClient) {
        this.headers = new HttpHeaders()
            .set("Accept", 'application/json')
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            .set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
            .set('Access-Control-Allow-Credentials', 'true');
    }


    getUsuarioWeb(login: any, senha: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/vendedor/autenticar?login=${login}&senha=${senha}`,
            { headers: this.headers }
        );
    }
    verificaUsuarioBloqueado(id) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/vendedor/bloqueado?vendedor_id=${id}`, { headers: this.headers });
    }

}