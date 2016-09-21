'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Funcionario Schema
 */
var FuncionarioSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Funcionario name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  /* Sicadi imported Schema */
  funcionario_id: Number,
  nome: String,
  nome_guerra: String,
  equipe_trabalho: String,
  cpf: String,
  rg: String,
  corretor: String,
  iss: String,
  creci: String,
  endereco: String,
  bairro: String,
  cidade: String,
  estado: String,
  cep: String,
  telefone1: String,
  telefone2: String,
  celular: String,
  bip: String,
  data_admissao: Date,
  data_demissao: Date,
  e_mail: String,
  senha01: String,
  senha02: String,
  senha03: String,
  senha04: String,
  senha05: String,
  ultima_atualizacao_senha: Date,
  periodo_troca: Number,
  horario_domingo: String,
  horario_segunda: String,
  horario_terca: String,
  horario_quarta: String,
  horario_quinta: String,
  horario_sexta: String,
  horario_sabado: String,
  supervisor_caixa: String,
  gerente_vendas: String,
  usuario_interno: String,
  ddd_fone1: String,
  ddd_fone2: String,
  ddd_celular: String,
  ultimo_login: Date,
  ultimo_ping: Date,
  ultimo_envio_permissao: Date,
  top_uso: Number
  /* Sicadi imported schema */
});

mongoose.model('Funcionario', FuncionarioSchema);
