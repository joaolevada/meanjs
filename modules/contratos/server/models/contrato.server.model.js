'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contrato Schema
 */
var ContratoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Contrato name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Contrato', ContratoSchema);
