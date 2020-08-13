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
    db: any;
    constructor(private httpClient: HttpClient, private dbService: DBService,
        private alertCtrl: AlertController, private loadingController: LoadingController) {
        this.db = dbService;
        this.headers = new HttpHeaders()
            .set("Accept", 'application/json')
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            .set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
            .set('Access-Control-Allow-Credentials', 'true');
    }
    async confirmAlert(header, message) {
        const alert = await this.alertCtrl.create({
            header: header,
            message: message,
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
            db.table('comissao').clear();
            db.table('responsavel').clear();
            db.table('titulo').clear();
            db.table('visita_nao_venda').clear();
            db.table('marcas_produto').clear();
            db.table('tipos_produto').clear();
            db.table('produto_tabela').clear();
            //add

            db.table('categoria').bulkPut(categorias);
            db.table('cidade').bulkPut(cidades);
            db.table('clientes').bulkPut(clientes);
            db.table('compras').bulkPut(compras);
            db.table('atividade').bulkPut(atividades);
            db.table('compras_item').bulkPut(compras_itens);
            db.table('forma').bulkPut(formas);
            db.table('condicoe').bulkPut(condicoes);
            db.table('itempedido').bulkPut(itenspedido);
            db.table('mensagem').bulkPut(mensagens);
            db.table('metas').bulkPut(meta_vendedor);
            db.table('motivos_nao_venda').bulkPut(motivos_nao_venda);
            db.table('pedido').bulkPut(pedidos);
            db.table('produto').bulkPut(produtos.produtos);
            db.table('comissao').bulkPut(produtos.comissoes);
            db.table('produto_tabela').bulkPut(produtos.tabelas);
            db.table('marcas_produto').bulkPut(produtos.marcas);
            db.table('tipos_produto').bulkPut(produtos.tipos);
            db.table('responsavel').bulkPut(responsaveis);
            db.table('tabela').bulkPut(tabelas);
            db.table('titulo').bulkPut(titulos);
            db.table('visita_nao_venda').bulkPut(visitas_nao_venda);
            forkJoin([
                this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/update/sync/vendedor?vendedor_id=${vendedor_id}`,
                    { headers: this.headers }
                ), this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/update/download/vendedor?vendedor_id=${vendedor_id}`,
                    { headers: this.headers }
                )])
                .subscribe(res => {
                    this.loadingController.dismiss();
                    this.confirmAlert('Mensagem', 'Sincronismo de Entrada efetuado com sucesso!');
                });

        })

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
    getCompras(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/lista/compras?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }
    sincronismo(vendedor_id: any) {
        return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/sincronismo?vendedor_id=${vendedor_id}`,
            { headers: this.headers }
        );
    }

    sincronizarSaida() {
        let self = this;
        let pedidos_num = 0, num_clientes = 0, num_visitas = 0;
        return forkJoin([
            self.db.pedido.where('tipo_pedido').notEqual('O').and(function (where) { return where.enviado == 'N'; }).toArray().then((pedidos) => {
                pedidos_num = pedidos.length;
                pedidos.map((pedido) => {
                    var cod_pedido = pedido.cod_pedido_mob;
                    self.db.itempedido.where('pedido_id').equals(cod_pedido).toArray().then(function (itenspedido) {
                        this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/inserir/pedido?
                        pedido_id=${pedido.pedido_id}&&
                        vendedor_id=${pedido.vendedor_id}&&
                        cliente_id=${pedido.cliente_id}&&
                        tipo_pedido=${pedido.tipo_pedido}&&
                        data_entrega=${pedido.data_entrega}&&
                        condicao_pagto_id=${pedido.codigo_forma_pagto}&&
                        tabela_id=${pedido.tabela_id}&&
                        observacao=${pedido.observacao}&&
                        num_itens=${pedido.num_itens}&&                    
                        total_itens=${pedido.total_itens}&&
                        percentual_desconto=${pedido.percentual_desconto}&&
                        total_pedido=${pedido.total_pedido}&&
                        urgente=${pedido.urgente}&&
                        data_gravacao=${pedido.data_gravacao}&&
                        hora_gravacao=${pedido.hora_gravacao}&&
                        latitude_gravacao=${pedido.latitude_gravacao}&&
                        longitude_gravacao=${pedido.longitude_gravacao}&&
                        itens=${JSON.stringify(itenspedido)} `,
                            { headers: this.headers }
                        ).subscribe(response => {
                            var pedido_id_web = response.pedido_id;
                            var ids_itens_web = response.itens_id;
                            self.db.pedido.update(cod_pedido, { pedido_id: pedido_id_web, enviado: 'S' });
                            ids_itens_web.map(function (value) {
                                self.db.itempedido.update(value.id_app, {
                                    pedido_id: pedido_id_web,
                                    enviado: 'S'
                                });
                            });
                        },
                            err => {
                                this.loadingController.dismiss();
                                alert('Problemas ao enviar/atualizar pedidos para o servidor.');
                                return false;
                            });
                    });
                })
                return pedidos_num;
            }),
            self.db.clientes.where('enviado').equals('N').toArray().then(function (clientes) {
                num_clientes = clientes.length;
                clientes.map(function (cliente) {
                    var cliente = cliente;
                    this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/inserir/cliente?cliente=${cliente}`,
                        { headers: this.headers }
                    ).subscribe(res => {
                        self.db.clientes.update(cliente.cli_id, { enviado: 'S' });
                        return num_clientes;
                    },
                        error => {
                            this.loadingController.dismiss();
                            alert('Problemas ao enviar/atualizar cliente para o servidor.');
                        });
                })
                return num_clientes;
            }),
            self.db.visita_nao_venda.where('enviado').equals('N').toArray().then(function (visitas) {
                num_visitas = visitas.length;
                visitas.map(function (visita) {
                    this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/inserir/visita?visita=${visita}`,
                        { headers: this.headers }
                    ).subscribe(res => {
                        self.db.visita_nao_venda.update(visita.cod_visita_mob, {
                            enviado: 'S',
                            visita_id: res.visita_id
                        });
                        return num_visitas;
                    },
                        error => {
                            this.loadingController.dismiss();
                            alert('Problemas ao enviar/atualizar visita para o servidor.');
                        });
                });
                return num_visitas;
            })
        ]);
    }

    sincronizarClientes(vendedor_id) {
        this.getClients(vendedor_id).subscribe(clientes => {
            localStorage.removeItem('sincronizar');
            this.db.clientes.clear();
            this.db.clientes.bulkPut(clientes);
            this.loadingController.dismiss();
            this.confirmAlert('Mensagem', 'Sincronismo de clientes efetuado com sucesso!');
        }, errr => {
            this.confirmAlert('Atenção', 'Conexão com o servidor falhou. Verifique sua rede ou tente novamente mais tarde.');
            this.loadingController.dismiss();
        });

    }
    sincronizarCompras(vendedor_id) {
        this.getCompras(vendedor_id).subscribe(res => {
            let compras = res['compras'];
            let compras_itens = res['itens'];
            localStorage.removeItem('sincronizar');
            this.db.compras.clear();
            this.db.compras_item.clear();
            this.db.compras.bulkPut(compras);
            this.db.compras_item.bulkPut(compras_itens);

            this.loadingController.dismiss();
            this.confirmAlert('Mensagem', 'Sincronismo de compras efetuado com sucesso!');
        }, errr => {
            this.confirmAlert('Atenção', 'Conexão com o servidor falhou. Verifique sua rede ou tente novamente mais tarde.');
            this.loadingController.dismiss();
        });

    }
    sincronizarProdutos(vendedor_id) {
        this.getProdutos(vendedor_id).subscribe(produtos => {

            this.db.comissao.clear(),
                this.db.produto.clear(),
                this.db.produto_tabela.clear(),
                this.db.marcas_produto.clear(),
                this.db.tipos_produto.clear()
            this.db.produto.bulkPut(produtos['produtos']),
                this.db.comissao.bulkPut(produtos['comissoes']),
                this.db.produto_tabela.bulkPut(produtos['tabelas']),
                this.db.marcas_produto.bulkPut(produtos['marcas']),
                this.db.tipos_produto.bulkPut(produtos['tipos'])
            localStorage.removeItem('sincronizar');

            this.loadingController.dismiss();
            this.confirmAlert('Mensagem', 'Sincronismo de produtos efetuado com sucesso!');
        }, errr => {
            this.confirmAlert('Atenção', 'Conexão com o servidor falhou. Verifique sua rede ou tente novamente mais tarde.');
            this.loadingController.dismiss();
        });

    }
    sincronizarTitulos(vendedor_id) {
        this.getTitulos(vendedor_id).subscribe(titulos => {

            this.db.titulo.clear();
            this.db.titulo.bulkPut(titulos);
            localStorage.removeItem('sincronizar');

            this.loadingController.dismiss();
            this.confirmAlert('Mensagem', 'Sincronismo de Títulos efetuado com sucesso!');
        }, errr => {
            this.confirmAlert('Atenção', 'Conexão com o servidor falhou. Verifique sua rede ou tente novamente mais tarde.');
            this.loadingController.dismiss();
        });

    }
    getApagarPedido(pedido_id) {       
      return this.httpClient.post(`${environment.AUTH_SERVER_ADDRESS}/pedido/excluir?pedido_id=${pedido_id}`,
            { headers: this.headers }
        );
    }

}