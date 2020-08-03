import { Injectable, OnInit } from '@angular/core';
import Dexie from 'dexie';


import { IEmailAddress, IPhoneNumber, Contact } from '../model/model';
@Injectable({
    providedIn: 'root'
})

export class DBService extends Dexie {

    public books = [];
    public users: any;
    headers: any;
    db: any;

    atividade: Dexie.Table<any, number>;
    usuario: Dexie.Table<any, number>;
    cidade: Dexie.Table<any, number>;
    categoria: Dexie.Table<any, number>;
    comissao: Dexie.Table<any, number>;
    compras_item: Dexie.Table<any, number>;
    condicao: Dexie.Table<any, number>;
    forma: Dexie.Table<any, number>;
    itempedido: Dexie.Table<any, number>;
    
    constructor() {
        super("ContactsDatabase");
        this.db = this;
        //
        // Define tables and indexes
        //
        this.db.version(1).stores({
            usuario: '++atividade_id,vendedor_id,vendedor_login,vendedor_senha,download_aplicativo',
            atividade: '++atividade_id,vendedor_id,descricaoatividade',
            categoria: '++categoria_id,vendedor_id,descricaocategoria',
            cidade: '++cidade_id,vendedor_id,descricaocidade,codigoibge,uf',
            clientes: '++cli_id,vendedor_id,cli_fantasia,cli_razaosocial,cli_endereco,cli_bairro,cli_codigocidade,cli_cep,cli_fax,cli_email,cli_pessoafj,cli_cnpjcpf,cli_inscricaoestadual,cli_inscricaomunicipal,cli_contato1,cli_contato2,cli_telefone1,cli_telefone2,cli_vip,cli_homepage,cli_limitecredito,cli_totaltitulosvencidos,cli_totaltitulosavencer,cli_saldo,cli_enderecoentrega,cli_bairroentrega,cli_codigocidadeentrega,cli_cepentrega,categoria_id,atividade_id,responsavel_id,tabela_id,condicaopagto_id,formapagto_id,credito_bloqueado,observacao,enviado,dia_visita,[categoria_id+atividade_id+responsavel_id+dia_visita],[categoria_id+atividade_id+dia_visita],[categoria_id+responsavel_id+dia_visita],[atividade_id+responsavel_id+dia_visita],[categoria_id+atividade_id+responsavel_id],[categoria_id+atividade_id],[categoria_id+responsavel_id],[atividade_id+responsavel_id]',
            comissao: '++id,*produto_id,vendedor_id,precoinicial,precofinal,comissao',
            compras: '++compras_id,compras_documento_nro,compras_tipo,compras_vendedor_id,compras_responsavel_id,compras_cliente_id,compras_cliente_nome,compras_cliente_fone,compras_datacompra,compras_totalcompra,compras_desconto,compras_totalcomissao',
            compras_item: '++compras_item_id,compras_id,compras_item_vendedor_id,compras_item_responsavel_id,compras_item_codigoproduto,compras_item_descricaoproduto,compras_item_unidadadeproduto,compras_item_quantidade,compras_item_precototal,compras_item_precounitario,compras_item_descontopercentual,compras_item_precotabela,compras_item_precocusto,compras_item_produtopromocao,compras_item_comissaopercentual,compras_item_comissaovaloritem',
            condicao: '++condicao_id,vendedor_id,descricao_condicao,percentual_acres_decrescimo,valor_minimo_pedido',
            forma: '++forma_id,vendedor_id,descricaoformapagamento',
            // ???
            itempedido: '++item_id,pedido_id,codigo_produto,descricao,tipo_item,quantidade,preco_unitario_bruto,desc_unitario_percentual,preco_unitario_comdesconto,valor_total_item,status,cliente_id,enviado',
            // mensagem_retorno
            //
            mensagem: '++contador_id,vendedor_id,mensagem,data,hora',
            metas: '++meta_id,vendedor_id,descricaometa,valormeta,valoratingido,diferenca,percentualatingido,percentualdesconto,totaldesconto',
            motivos_nao_venda: '++motivo_id,vendedor_id,descricaomotivo',
            pedido: '++cod_pedido_mob,pedido_id,vendedor_id,cliente_id,data_entrega,tipo_pedido,codigo_condicao_pagto,codigo_forma_pagto,codigo_tabela_preco,observacao,numero_itens,total_itens,desc_financ_percentual,total_pedido,status,urgente,data_gravacao,hora_gravacao,data_gravacao_ftp,hora_gravacao_ftp,data_sincronismo,hora_sincronismo,gravado_erp,enviado,latitude_gravacao,longitude_gravacao',
            produto: '++produto_id,vendedor_id,descricaoproduto,embalagem,qtde_minimo_venda,precopadrao,custo,codigobarras,estoque_offline,obs,produtoemfalta,produtonovo,produtoempromocao,data_inicio_promocao,data_fim_promocao,quant_minima_promocao,preco_promocao,desc_maximopercentual,inf_marca,inf_produto,comissao,dados_adicionais,[inf_marca+inf_produto],[inf_marca+produtoempromocao],[inf_marca+inf_produto+produtoempromocao],[inf_produto+produtoempromocao]',
            produto_tabela: '[produto_id+tabela_id],vendedor_id,precotabela',
            responsavel: '[responsavel_id+vendedor_id],descricaoresponsavel',
            tabela: '++tabela_id,vendedor_id,descricaotabela',
            titulo: '++contador,numerotitulo,cliente_id,vendedor_id,parcel,dataemissao,datavencimento,valor,saldo,juros',
            // ???
            // vendedores
            //
            visita_nao_venda: '++cod_visita_mob,visita_id,vendedor_id,cliente_id,motivo_id,data_visita,contato_visita,observacao,data_gravacao,hora_gravacao,latitude_gravacao,longetude_gravacao,enviado,tipo_visita',
            // ??? abaixo tabelas que não existe (com este nome e atributos ao menos)
            marcas_produto: 'inf_marca',
            tipos_produto: 'inf_produto',
           
        });


        // Let's physically map Contact class to contacts table.
        // This will make it possible to call loadEmailsAndPhones()
        // directly on retrieved database objects.

        this.db.atividade.mapToClass(this.atividade);
        this.db.cidade.mapToClass(this.cidade);
        this.db.categoria.mapToClass(this.categoria);

        this.db.comissao.mapToClass(this.comissao);

        this.db.compras_item.mapToClass(this.compras_item);
        this.db.condicao.mapToClass(this.condicao);
        this.db.forma.mapToClass(this.forma);
        this.db.itempedido.mapToClass(this.itempedido);
        this.db.usuario.mapToClass(this.usuario);
       
    }
    OnInit() {
    }



    // _atualizaIdClientePedido(clientes: any) {
    //     if (clientes.length > 0) {
    //         clientes.foreach(i => {
    //             if (clientes[i].cli_id != new Number(clientes[i].cli_cnpjcpf)) {
    //                 this.dexieService.pedido
    //                     .where('cliente_id')
    //                     .equals(clientes[i].cli_cnpjcpf)
    //                     .modify({
    //                         cliente_id: clientes[i].cli_id
    //                     });
    //             }
    //             if (Number(clientes.length) == Number(i) + 1) {
    //                 return true;
    //             }
    //         })
    //     } else {
    //         return true;
    //     }

    // }


}
export var db = new DBService();