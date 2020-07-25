import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class dataService {

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



    getClients(vendedor_id: any, take: any, skip: any) {
        // return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}`,
        //     { headers: this.headers }
        // );
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}&&take=${take}&&skip=${skip}`,
            { headers: this.headers }
        );
    }
    getProdutos(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/produtos?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }

    getTitulos(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/titulos?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }
    getMetas(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/metas/vendedor?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }
    getMensagens(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/mensagens?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }

}