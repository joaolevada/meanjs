'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Funcionario = mongoose.model('Funcionario'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Funcionario
 */
exports.create = function(req, res) {
  var funcionario = new Funcionario(req.body);
  funcionario.user = req.user;

  funcionario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(funcionario);
    }
  });
};

/**
 * Show the current Funcionario
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var funcionario = req.funcionario ? req.funcionario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  funcionario.isCurrentUserOwner = req.user && funcionario.user && funcionario.user._id.toString() === req.user._id.toString();

  res.jsonp(funcionario);
};

/**
 * Update a Funcionario
 */
exports.update = function(req, res) {
  var funcionario = req.funcionario;

  funcionario = _.extend(funcionario, req.body);

  funcionario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(funcionario);
    }
  });
};

/**
 * Delete an Funcionario
 */
exports.delete = function(req, res) {
  var funcionario = req.funcionario;

  funcionario.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(funcionario);
    }
  });
};

/**
 * List of Funcionarios
 */
exports.list = function(req, res) {
  Funcionario.find().sort('-created').populate('user', 'displayName').exec(function(err, funcionarios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(funcionarios);
    }
  });
};

/**
 * Funcionario middleware
 */
exports.funcionarioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Funcionario is invalid'
    });
  }

  Funcionario.findById(id).populate('user', 'displayName').exec(function (err, funcionario) {
    if (err) {
      return next(err);
    } else if (!funcionario) {
      return res.status(404).send({
        message: 'No Funcionario with that identifier has been found'
      });
    }
    req.funcionario = funcionario;
    next();
  });
};
