'use strict';

/**
 * Module dependencies
 */
var funcionariosPolicy = require('../policies/funcionarios.server.policy'),
  funcionarios = require('../controllers/funcionarios.server.controller');

module.exports = function(app) {
  // Funcionarios Routes
  app.route('/api/funcionarios').all(funcionariosPolicy.isAllowed)
    .get(funcionarios.list)
    .post(funcionarios.create);

  app.route('/api/funcionarios/:funcionarioId').all(funcionariosPolicy.isAllowed)
    .get(funcionarios.read)
    .put(funcionarios.update)
    .delete(funcionarios.delete);

  // Finish by binding the Funcionario middleware
  app.param('funcionarioId', funcionarios.funcionarioByID);
};
