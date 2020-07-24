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



    getClients(vendedor_id: any) {  
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
     
    }
    getProdutos(vendedor_id: any) {      
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/produtos?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );     
    }
   
    getTitulos(vendedor_id: any) {
        vendedor_id = 501;
        let titulos = [{
            "contador": 11677581,
            "cliente_id": 22578,
            "vendedor_id": 501,
            "responsavel_id": 34,
            "numerotitulo": 799,
            "parcela": "1-1",
            "dataemissao": "2020-05-25 00:00:00",
            "datavencimento": "2020-06-09 00:00:00",
            "valor": "3537.50",
            "saldo": "0.00",
            "juros": "35.38",
            "cliente_nome": "PETSISTER RACOES LTDA",
            "cliente_contato": "",
            "cliente_fone": "34067658"
        },
        {
            "contador": 11677582,
            "cliente_id": 22578,
            "vendedor_id": 501,
            "responsavel_id": 34,
            "numerotitulo": 798,
            "parcela": "1-1",
            "dataemissao": "2020-05-25 00:00:00",
            "datavencimento": "2020-06-09 00:00:00",
            "valor": "3617.28",
            "saldo": "0.00",
            "juros": "36.17",
            "cliente_nome": "PETSISTER RACOES LTDA",
            "cliente_contato": "",
            "cliente_fone": "34067658"
        },
        {
            "contador": 11677583,
            "cliente_id": 921,
            "vendedor_id": 501,
            "responsavel_id": 1,
            "numerotitulo": 82584,
            "parcela": "1-1",
            "dataemissao": "2020-04-27 00:00:00",
            "datavencimento": "2020-05-26 00:00:00",
            "valor": "460.18",
            "saldo": "0.00",
            "juros": "17.49",
            "cliente_nome": "EUNICE LEAL DE OLIVEIRA COMERCIO DE RACO",
            "cliente_contato": "",
            "cliente_fone": "0212693.5678"
        },
        {
            "contador": 11677584,
            "cliente_id": 663,
            "vendedor_id": 501,
            "responsavel_id": 34,
            "numerotitulo": 83227,
            "parcela": "1-1",
            "dataemissao": "2020-06-01 00:00:00",
            "datavencimento": "2020-06-16 00:00:00",
            "valor": "177.45",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "CEZARAO PROD. AGROPECUARIOS LTDA.",
            "cliente_contato": "MARCIO",
            "cliente_fone": "0213395.4382"
        },
        {
            "contador": 11677585,
            "cliente_id": 12602,
            "vendedor_id": 501,
            "responsavel_id": 34,
            "numerotitulo": 83226,
            "parcela": "1-1",
            "dataemissao": "2020-06-01 00:00:00",
            "datavencimento": "2020-06-16 00:00:00",
            "valor": "211.80",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "M. A. CORREIA RACOES PROD. AGROPECUARIA",
            "cliente_contato": "",
            "cliente_fone": "0212695.0472377"
        },
        {
            "contador": 11677586,
            "cliente_id": 19313,
            "vendedor_id": 501,
            "responsavel_id": 24,
            "numerotitulo": 19168,
            "parcela": "1-1",
            "dataemissao": "2020-05-29 00:00:00",
            "datavencimento": "2020-06-16 00:00:00",
            "valor": "342.20",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "ANDRE DA SILVA SOARES",
            "cliente_contato": "ANDRE",
            "cliente_fone": "22011659"
        },
        {
            "contador": 11677587,
            "cliente_id": 21229,
            "vendedor_id": 501,
            "responsavel_id": 30,
            "numerotitulo": 19092,
            "parcela": "1-1",
            "dataemissao": "2020-05-25 00:00:00",
            "datavencimento": "2020-06-16 00:00:00",
            "valor": "318.59",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "PET SHOP MATOSO EIRELI",
            "cliente_contato": "",
            "cliente_fone": "25044282"
        },
        {
            "contador": 11677588,
            "cliente_id": 1924,
            "vendedor_id": 501,
            "responsavel_id": 13,
            "numerotitulo": 19343,
            "parcela": "1-1",
            "dataemissao": "2020-06-15 00:00:00",
            "datavencimento": "2020-06-30 00:00:00",
            "valor": "208.32",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "MONIKA BURKARDT.",
            "cliente_contato": "",
            "cliente_fone": "0212275.0358"
        },
        {
            "contador": 11677589,
            "cliente_id": 1739,
            "vendedor_id": 501,
            "responsavel_id": 1,
            "numerotitulo": 19238,
            "parcela": "1-1",
            "dataemissao": "2020-06-03 00:00:00",
            "datavencimento": "2020-06-18 00:00:00",
            "valor": "230.17",
            "saldo": "0.00",
            "juros": "0.00",
            "cliente_nome": "ARI COTA.",
            "cliente_contato": "ANDREIA",
            "cliente_fone": "0212655.4202"
        },];
        return titulos;
    }
    getMetas(vendedor_id: any) {
        return this.httpClient.post(`http://191.252.56.160/metas/vendedor?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }
    getMensagens(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/mensagens?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }

}