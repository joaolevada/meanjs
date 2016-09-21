'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cliente Schema
 */
var ClienteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  cliente_id: Number,
  codigo: {
    type: String,
    default: '',
    required: 'Por favor, preencha o c&oacute;digo do cliente',
    trim: true
  },
  tipo_cliente: String,
  nome: {
    type: String,
    default: '',
    required: 'Por favor, preencha o nome do cliente',
    trim: true
  },
  sexo: String,
  data_nascimento: Date,
  nacionalidade: String,
  rg: String,
  cic_cgc: String,
  estado_civil: String,
  nome_pai: String,
  nome_mae: String,
  codigo_conjuge: Number,
  data_cadastro: Date,
  profissao: String,
  empresa: String,
  cargo: String,
  tempo_trabalho: String,
  responsavel_pessoa_juridica: Number,
  observacao: String,
  ativo: String,
  regime_casamento: String,
  dimensoes_terreno: String,
  chaves: String,
  e_mail: String,
  senha: String,
  notificar_por_email: String,
  observacao_cliente: String,
  inscricao_estadual: String,
  tipo_contribuinte_icms: Number,
  enderecos: [{ correspondencia: String, bairro: String, cidade: String, estado: String, cep: String, complemento: String, tipo_endereco: String }],
  telefones: [{ ddd: String, telefone: String, tipo_fone: String, complemento: String, telefone_principal: String }]
});

mongoose.model('Cliente', ClienteSchema);
