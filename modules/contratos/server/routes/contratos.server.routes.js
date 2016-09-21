'use strict';

/**
 * Module dependencies
 */
var contratosPolicy = require('../policies/contratos.server.policy'),
  contratos = require('../controllers/contratos.server.controller');

module.exports = function(app) {
  // Contratos Routes
  app.route('/api/contratos').all(contratosPolicy.isAllowed)
    .get(contratos.list)
    .post(contratos.create);

  app.route('/api/contratos/:contratoId').all(contratosPolicy.isAllowed)
    .get(contratos.read)
    .put(contratos.update)
    .delete(contratos.delete);

  // Finish by binding the Contrato middleware
  app.param('contratoId', contratos.contratoByID);
};
