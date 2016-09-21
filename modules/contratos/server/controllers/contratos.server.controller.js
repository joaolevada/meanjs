'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contrato = mongoose.model('Contrato'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contrato
 */
exports.create = function(req, res) {
  var contrato = new Contrato(req.body);
  contrato.user = req.user;

  contrato.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contrato);
    }
  });
};

/**
 * Show the current Contrato
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var contrato = req.contrato ? req.contrato.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contrato.isCurrentUserOwner = req.user && contrato.user && contrato.user._id.toString() === req.user._id.toString();

  res.jsonp(contrato);
};

/**
 * Update a Contrato
 */
exports.update = function(req, res) {
  var contrato = req.contrato;

  contrato = _.extend(contrato, req.body);

  contrato.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contrato);
    }
  });
};

/**
 * Delete an Contrato
 */
exports.delete = function(req, res) {
  var contrato = req.contrato;

  contrato.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contrato);
    }
  });
};

/**
 * List of Contratos
 */
exports.list = function(req, res) {
  Contrato.find().sort('-created').populate('user', 'displayName').exec(function(err, contratos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contratos);
    }
  });
};

/**
 * Contrato middleware
 */
exports.contratoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contrato is invalid'
    });
  }

  Contrato.findById(id).populate('user', 'displayName').exec(function (err, contrato) {
    if (err) {
      return next(err);
    } else if (!contrato) {
      return res.status(404).send({
        message: 'No Contrato with that identifier has been found'
      });
    }
    req.contrato = contrato;
    next();
  });
};
