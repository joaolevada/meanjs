'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cliente = mongoose.model('Cliente');

/**
 * Globals
 */
var user,
  cliente;

/**
 * Unit tests
 */
describe('Cliente Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      cliente = new Cliente({
        codigo: '00001',
        nome: 'Nome do cliente',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(10000);
      cliente.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without codigo', function(done) {
      cliente.codigo = '';

      cliente.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without nome', function(done) {
      cliente.nome = '';

      cliente.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Cliente.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
