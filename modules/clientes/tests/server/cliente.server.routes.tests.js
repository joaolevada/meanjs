'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cliente = mongoose.model('Cliente'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cliente;

/**
 * Cliente routes tests
 */
describe('Cliente CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Cliente
    user.save(function () {
      cliente = {
        codigo: 'Codigo',
        nome: 'Nome do cliente'
      };

      done();
    });
  });

  it('should be able to save a Cliente if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cliente
        agent.post('/api/clientes')
          .send(cliente)
          .expect(200)
          .end(function (clienteSaveErr, clienteSaveRes) {
            // Handle Cliente save error
            if (clienteSaveErr) {
              return done(clienteSaveErr);
            }

            // Get a list of Clientes
            agent.get('/api/clientes')
              .end(function (clientesGetErr, clientesGetRes) {
                // Handle Clientes save error
                if (clientesGetErr) {
                  return done(clientesGetErr);
                }

                // Get Clientes list
                var clientes = clientesGetRes.body;

                // Set assertions
                (clientes[0].user._id).should.equal(userId);
                (clientes[0].nome).should.match('Nome do cliente');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cliente if not logged in', function (done) {
    agent.post('/api/clientes')
      .send(cliente)
      .expect(403)
      .end(function (clienteSaveErr, clienteSaveRes) {
        // Call the assertion callback
        done(clienteSaveErr);
      });
  });

  it('should not be able to save an Cliente if no codigo is provided', function (done) {
    // Invalidate codigo field
    cliente.codigo = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cliente
        agent.post('/api/clientes')
          .send(cliente)
          .expect(400)
          .end(function (clienteSaveErr, clienteSaveRes) {
            // Set message assertion
            (clienteSaveRes.body.message).should.match('Por favor, preencha o c&oacute;digo do cliente');

            // Handle Cliente save error
            done(clienteSaveErr);
          });
      });
  });

  it('should not be able to save an Cliente if no nome is provided', function (done) {
    // Invalidate name field
    cliente.nome = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cliente
        agent.post('/api/clientes')
          .send(cliente)
          .expect(400)
          .end(function (clienteSaveErr, clienteSaveRes) {
            // Set message assertion
            (clienteSaveRes.body.message).should.match('Por favor, preencha o nome do cliente');

            // Handle Cliente save error
            done(clienteSaveErr);
          });
      });
  });

  it('should be able to update an Cliente if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cliente
        agent.post('/api/clientes')
          .send(cliente)
          .expect(200)
          .end(function (clienteSaveErr, clienteSaveRes) {
            // Handle Cliente save error
            if (clienteSaveErr) {
              return done(clienteSaveErr);
            }

            // Update Cliente nome
            cliente.nome = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cliente
            agent.put('/api/clientes/' + clienteSaveRes.body._id)
              .send(cliente)
              .expect(200)
              .end(function (clienteUpdateErr, clienteUpdateRes) {
                // Handle Cliente update error
                if (clienteUpdateErr) {
                  return done(clienteUpdateErr);
                }

                // Set assertions
                (clienteUpdateRes.body._id).should.equal(clienteSaveRes.body._id);
                (clienteUpdateRes.body.nome).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Clientes if not signed in', function (done) {
    // Create new Cliente model instance
    var clienteObj = new Cliente(cliente);

    // Save the cliente
    clienteObj.save(function () {
      // Request Clientes
      request(app).get('/api/clientes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cliente if not signed in', function (done) {
    // Create new Cliente model instance
    var clienteObj = new Cliente(cliente);

    // Save the Cliente
    clienteObj.save(function () {
      request(app).get('/api/clientes/' + clienteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('nome', cliente.nome);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cliente with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/clientes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cliente is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cliente which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cliente
    request(app).get('/api/clientes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cliente with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cliente if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cliente
        agent.post('/api/clientes')
          .send(cliente)
          .expect(200)
          .end(function (clienteSaveErr, clienteSaveRes) {
            // Handle Cliente save error
            if (clienteSaveErr) {
              return done(clienteSaveErr);
            }

            // Delete an existing Cliente
            agent.delete('/api/clientes/' + clienteSaveRes.body._id)
              .send(cliente)
              .expect(200)
              .end(function (clienteDeleteErr, clienteDeleteRes) {
                // Handle cliente error error
                if (clienteDeleteErr) {
                  return done(clienteDeleteErr);
                }

                // Set assertions
                (clienteDeleteRes.body._id).should.equal(clienteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cliente if not signed in', function (done) {
    // Set Cliente user
    cliente.user = user;

    // Create new Cliente model instance
    var clienteObj = new Cliente(cliente);

    // Save the Cliente
    clienteObj.save(function () {
      // Try deleting Cliente
      request(app).delete('/api/clientes/' + clienteObj._id)
        .expect(403)
        .end(function (clienteDeleteErr, clienteDeleteRes) {
          // Set message assertion
          (clienteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cliente error error
          done(clienteDeleteErr);
        });

    });
  });

  it('should be able to get a single Cliente that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Cliente
          agent.post('/api/clientes')
            .send(cliente)
            .expect(200)
            .end(function (clienteSaveErr, clienteSaveRes) {
              // Handle Cliente save error
              if (clienteSaveErr) {
                return done(clienteSaveErr);
              }

              // Set assertions on new Cliente
              (clienteSaveRes.body.nome).should.equal(cliente.nome);
              should.exist(clienteSaveRes.body.user);
              should.equal(clienteSaveRes.body.user._id, orphanId);

              // force the Cliente to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Cliente
                    agent.get('/api/clientes/' + clienteSaveRes.body._id)
                      .expect(200)
                      .end(function (clienteInfoErr, clienteInfoRes) {
                        // Handle Cliente error
                        if (clienteInfoErr) {
                          return done(clienteInfoErr);
                        }

                        // Set assertions
                        (clienteInfoRes.body._id).should.equal(clienteSaveRes.body._id);
                        (clienteInfoRes.body.nome).should.equal(cliente.nome);
                        should.equal(clienteInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should return a list of clientes by nome', function(done) {

    // Create new Cliente model instance
    var clienteObj = new Cliente(cliente);
    clienteObj.nome = 'WHY YOU GOTTA BE SO MEAN?';

    // Save the cliente
    clienteObj.save(function () {
      // Request Clientes
      request(app).get('/api/clientes/nome/' + encodeURIComponent(clienteObj.nome))
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should return a error if a too short nome is provided', function(done) {
    // Request Clientes
    request(app).get('/api/clientes/nome/aa')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', '&Eacute; necess&aacute;rio fornecer um nome, com pelo menos 3 letras para procurar um cliente');

        // Call the assertion callback
        done();
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cliente.remove().exec(done);
    });
  });
});
