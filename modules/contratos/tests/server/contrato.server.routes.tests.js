'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contrato = mongoose.model('Contrato'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contrato;

/**
 * Contrato routes tests
 */
describe('Contrato CRUD tests', function () {

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

    // Save a user to the test db and create new Contrato
    user.save(function () {
      contrato = {
        name: 'Contrato name'
      };

      done();
    });
  });

  it('should be able to save a Contrato if logged in', function (done) {
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

        // Save a new Contrato
        agent.post('/api/contratos')
          .send(contrato)
          .expect(200)
          .end(function (contratoSaveErr, contratoSaveRes) {
            // Handle Contrato save error
            if (contratoSaveErr) {
              return done(contratoSaveErr);
            }

            // Get a list of Contratos
            agent.get('/api/contratos')
              .end(function (contratosGetErr, contratosGetRes) {
                // Handle Contratos save error
                if (contratosGetErr) {
                  return done(contratosGetErr);
                }

                // Get Contratos list
                var contratos = contratosGetRes.body;

                // Set assertions
                (contratos[0].user._id).should.equal(userId);
                (contratos[0].name).should.match('Contrato name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contrato if not logged in', function (done) {
    agent.post('/api/contratos')
      .send(contrato)
      .expect(403)
      .end(function (contratoSaveErr, contratoSaveRes) {
        // Call the assertion callback
        done(contratoSaveErr);
      });
  });

  it('should not be able to save an Contrato if no name is provided', function (done) {
    // Invalidate name field
    contrato.name = '';

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

        // Save a new Contrato
        agent.post('/api/contratos')
          .send(contrato)
          .expect(400)
          .end(function (contratoSaveErr, contratoSaveRes) {
            // Set message assertion
            (contratoSaveRes.body.message).should.match('Please fill Contrato name');

            // Handle Contrato save error
            done(contratoSaveErr);
          });
      });
  });

  it('should be able to update an Contrato if signed in', function (done) {
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

        // Save a new Contrato
        agent.post('/api/contratos')
          .send(contrato)
          .expect(200)
          .end(function (contratoSaveErr, contratoSaveRes) {
            // Handle Contrato save error
            if (contratoSaveErr) {
              return done(contratoSaveErr);
            }

            // Update Contrato name
            contrato.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contrato
            agent.put('/api/contratos/' + contratoSaveRes.body._id)
              .send(contrato)
              .expect(200)
              .end(function (contratoUpdateErr, contratoUpdateRes) {
                // Handle Contrato update error
                if (contratoUpdateErr) {
                  return done(contratoUpdateErr);
                }

                // Set assertions
                (contratoUpdateRes.body._id).should.equal(contratoSaveRes.body._id);
                (contratoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contratos if not signed in', function (done) {
    // Create new Contrato model instance
    var contratoObj = new Contrato(contrato);

    // Save the contrato
    contratoObj.save(function () {
      // Request Contratos
      request(app).get('/api/contratos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contrato if not signed in', function (done) {
    // Create new Contrato model instance
    var contratoObj = new Contrato(contrato);

    // Save the Contrato
    contratoObj.save(function () {
      request(app).get('/api/contratos/' + contratoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contrato.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contrato with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contratos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contrato is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contrato which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contrato
    request(app).get('/api/contratos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contrato with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contrato if signed in', function (done) {
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

        // Save a new Contrato
        agent.post('/api/contratos')
          .send(contrato)
          .expect(200)
          .end(function (contratoSaveErr, contratoSaveRes) {
            // Handle Contrato save error
            if (contratoSaveErr) {
              return done(contratoSaveErr);
            }

            // Delete an existing Contrato
            agent.delete('/api/contratos/' + contratoSaveRes.body._id)
              .send(contrato)
              .expect(200)
              .end(function (contratoDeleteErr, contratoDeleteRes) {
                // Handle contrato error error
                if (contratoDeleteErr) {
                  return done(contratoDeleteErr);
                }

                // Set assertions
                (contratoDeleteRes.body._id).should.equal(contratoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contrato if not signed in', function (done) {
    // Set Contrato user
    contrato.user = user;

    // Create new Contrato model instance
    var contratoObj = new Contrato(contrato);

    // Save the Contrato
    contratoObj.save(function () {
      // Try deleting Contrato
      request(app).delete('/api/contratos/' + contratoObj._id)
        .expect(403)
        .end(function (contratoDeleteErr, contratoDeleteRes) {
          // Set message assertion
          (contratoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contrato error error
          done(contratoDeleteErr);
        });

    });
  });

  it('should be able to get a single Contrato that has an orphaned user reference', function (done) {
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

          // Save a new Contrato
          agent.post('/api/contratos')
            .send(contrato)
            .expect(200)
            .end(function (contratoSaveErr, contratoSaveRes) {
              // Handle Contrato save error
              if (contratoSaveErr) {
                return done(contratoSaveErr);
              }

              // Set assertions on new Contrato
              (contratoSaveRes.body.name).should.equal(contrato.name);
              should.exist(contratoSaveRes.body.user);
              should.equal(contratoSaveRes.body.user._id, orphanId);

              // force the Contrato to have an orphaned user reference
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

                    // Get the Contrato
                    agent.get('/api/contratos/' + contratoSaveRes.body._id)
                      .expect(200)
                      .end(function (contratoInfoErr, contratoInfoRes) {
                        // Handle Contrato error
                        if (contratoInfoErr) {
                          return done(contratoInfoErr);
                        }

                        // Set assertions
                        (contratoInfoRes.body._id).should.equal(contratoSaveRes.body._id);
                        (contratoInfoRes.body.name).should.equal(contrato.name);
                        should.equal(contratoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Contrato.remove().exec(done);
    });
  });
});
