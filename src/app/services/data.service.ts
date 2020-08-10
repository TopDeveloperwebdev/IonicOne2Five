import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { DBService } from '../services/DB.service';
import { Platform, ModalController, NavController, MenuController, ToastController, AlertController, LoadingController, ActionSheetController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class dataService {

    public books = [];
    public users: any;
    headers: any;
    constructor(private httpClient: HttpClient, private dbService: DBService,
        private alertCtrl: AlertController, private loadingController: LoadingController) {
        this.headers = new HttpHeaders()
            .set("Accept", 'application/json')
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            .set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
            .set('Access-Control-Allow-Credentials', 'true');
    }

    async presentConfirm() {
        console.log('Alert Shown Method Accessed!');
        const alert = await this.alertCtrl.create({
            header: 'Mensagem',
            message: 'Sincronismo de Entrada efetuado com sucesso!',
            buttons: [
                {
                    text: 'Fechar',
                    role: 'cancel',
                    cssClass: 'button button-assertive',
                }
            ]
        });
        await alert.present();
    }
    init(vendedor_id: any) {
        let clientes;
        let atividades;
        let categorias;
        let cidades;
        let tabelas;
        let formas;
        let condicoes;
        let produtos;
        let mensagens;
        let meta_vendedor;
        let titulos;
        let pedidos;
        let itenspedido;
        let produto_tabela;
        let responsaveis;
        let motivos_nao_venda;
        let visitas_nao_venda;
        let compras;
        let compras_itens;

        forkJoin([
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/atividades?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/categorias?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cidades?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/tabela?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/formapagto?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/condicaopagto?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/produtos?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/mensagens?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/metas/vendedor?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/titulos?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/pedidos?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/itenspedido?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/produtostabela?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/responsaveis?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/motivos/naovenda?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/visita/naovenda?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            ),
            this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/compras?vendedor_id=${vendedor_id}`,
                { headers: this.headers }
            )
        ]).subscribe(res => {

            clientes = res[0];
            atividades = res[1];
            categorias = res[2];
            cidades = res[3];
            tabelas = res[4];
            formas = res[5];
            condicoes = res[6];
            produtos = res[7];
            mensagens = res[8];
            meta_vendedor = res[9];
            titulos = res[10];
            pedidos = res[11];
            itenspedido = res[12];
            produto_tabela = res[13];
            responsaveis = res[14];
            motivos_nao_venda = res[15];
            visitas_nao_venda = res[16];
            compras = res[17]['compras'];
            compras_itens = res[17]['itens'];
            let db = this.dbService;
            localStorage.removeItem('sincronizar');
            db.table('clientes').clear();
            db.table('atividade').clear();
            db.table('categoria').clear();
            db.table('cidade').clear();
            db.table('tabela').clear();
            db.table('compras').clear();
            db.table('forma').clear();
            db.table('condicoe').clear();
            db.table('itempedido').clear();
            db.table('mensagem').clear();
            db.table('metas').clear();
            db.table('motivos_nao_venda').clear();
            db.table('pedido').clear();
            db.table('produto').clear();          
            db.table('responsavel').clear();
            db.table('titulo').clear();
            db.table('visita_nao_venda').clear();
            db.table('marcas_produto').clear();
            db.table('tipos_produto').clear();
            db.table('produto_tabela').clear();     
            //add

            db.table('categoria').add(categorias);
            db.table('cidade').add(cidades);
            db.table('clientes').add(clientes);
            db.table('compras').add(compras);
            db.table('atividade').add(atividades);
            db.table('compras_item').add(compras_itens);
            db.table('forma').add(formas);
            db.table('condicoe').add(condicoes);
            db.table('itempedido').add(itenspedido);
            db.table('mensagem').add(mensagens);
            db.table('metas').add(meta_vendedor);
            db.table('motivos_nao_venda').add(motivos_nao_venda);
            db.table('pedido').add(pedidos);
            db.table('produto').bulkPut(produtos.produtos);
            db.table('comissao').bulkPut(produtos.comissao);
            db.table('produto_tabela').bulkPut(produtos.produto_tabela);
            db.table('marcas_produto').bulkPut(produtos.marcas);
            db.table('tipos_produto').bulkPut(produtos.tipos);         
            db.table('responsavel').add(responsaveis);
            db.table('tabela').add(tabelas);
            db.table('titulo').add(titulos);
            db.table('visita_nao_venda').add(visitas_nao_venda);
            forkJoin([
                this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/update/sync/vendedor?vendedor_id=${vendedor_id}`,
                    { headers: this.headers }
                ), this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/update/download/vendedor?vendedor_id=${vendedor_id}`,
                    { headers: this.headers }
                )])
                .subscribe(res => {
                    this.loadingController.dismiss();
                    this.presentConfirm();
                    // $ionicPopup.alert({
                    //     title: 'Mensagem',
                    //     template: 'Sincronismo de Entrada efetuado com sucesso!',
                    //     buttons: [
                    //         {
                    //             text: 'Fechar',
                    //             type: 'button-assertive',
                    //         }
                    //     ]
                    // });
                });

        })

    }


    getClients(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
        // return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/cliente?vendedor_id=${vendedor_id}&&take=${take}&&skip=${skip}`,
        //     { headers: this.headers }
        // );
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