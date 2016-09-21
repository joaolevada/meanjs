'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cliente = mongoose.model('Cliente'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cliente
 */
exports.create = function(req, res) {
  var cliente = new Cliente(req.body);
  cliente.user = req.user;

  cliente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cliente);
    }
  });
};

/**
 * Show the current Cliente
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cliente = req.cliente ? req.cliente.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cliente.isCurrentUserOwner = req.user && cliente.user && cliente.user._id.toString() === req.user._id.toString();

  res.jsonp(cliente);
};

/**
 * Update a Cliente
 */
exports.update = function(req, res) {
  var cliente = req.cliente;

  cliente = _.extend(cliente, req.body);

  cliente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cliente);
    }
  });
};

/**
 * Delete an Cliente
 */
exports.delete = function(req, res) {
  var cliente = req.cliente;

  cliente.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cliente);
    }
  });
};

/**
 * List of Clientes
 */
exports.list = function(req, res) {
  Cliente.find().sort('-created').populate('user', 'displayName').exec(function(err, clientes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientes);
    }
  });
};

/**
 * Cliente middleware
 */
exports.clienteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cliente is invalid'
    });
  }

  Cliente.findById(id).populate('user', 'displayName').exec(function (err, cliente) {
    if (err) {
      return next(err);
    } else if (!cliente) {
      return res.status(404).send({
        message: 'No Cliente with that identifier has been found'
      });
    }
    req.cliente = cliente;
    next();
  });
};

exports.clienteByNome = function(req, res) {

  var nome;
  nome = req.params.nome;

  if ((!nome) || (nome.length < 3)) {
    return res.status(400).send({
      message: '&Eacute; necess&aacute;rio fornecer um nome, com pelo menos 3 letras para procurar um cliente'
    });
  }

  Cliente.find({ 'nome': { $gte: nome } }).populate('user', 'displayName').exec(function (err, clientes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clientes);
    }
  });

};
