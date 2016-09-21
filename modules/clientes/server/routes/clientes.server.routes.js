'use strict';

/**
 * Module dependencies
 */
var clientesPolicy = require('../policies/clientes.server.policy'),
  clientes = require('../controllers/clientes.server.controller');

module.exports = function(app) {
  // Clientes Routes
  app.route('/api/clientes').all(clientesPolicy.isAllowed)
    .get(clientes.list)
    .post(clientes.create);

  app.route('/api/clientes/:clienteId').all(clientesPolicy.isAllowed)
    .get(clientes.read)
    .put(clientes.update)
    .delete(clientes.delete);

  app.route('/api/clientes/nome/:nome').all(clientesPolicy.isAllowed);

  // Finish by binding the Cliente middleware
  app.param('clienteId', clientes.clienteByID);
  app.param('nome', clientes.clienteByNome);
};
