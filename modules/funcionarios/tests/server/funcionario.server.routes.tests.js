'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Funcionario = mongoose.model('Funcionario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  funcionario;

/**
 * Funcionario routes tests
 */
describe('Funcionario CRUD tests', function () {

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

    // Save a user to the test db and create new Funcionario
    user.save(function () {
      funcionario = {
        name: 'Funcionario name'
      };

      done();
    });
  });

  it('should be able to save a Funcionario if logged in', function (done) {
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

        // Save a new Funcionario
        agent.post('/api/funcionarios')
          .send(funcionario)
          .expect(200)
          .end(function (funcionarioSaveErr, funcionarioSaveRes) {
            // Handle Funcionario save error
            if (funcionarioSaveErr) {
              return done(funcionarioSaveErr);
            }

            // Get a list of Funcionarios
            agent.get('/api/funcionarios')
              .end(function (funcionariosGetErr, funcionariosGetRes) {
                // Handle Funcionarios save error
                if (funcionariosGetErr) {
                  return done(funcionariosGetErr);
                }

                // Get Funcionarios list
                var funcionarios = funcionariosGetRes.body;

                // Set assertions
                (funcionarios[0].user._id).should.equal(userId);
                (funcionarios[0].name).should.match('Funcionario name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Funcionario if not logged in', function (done) {
    agent.post('/api/funcionarios')
      .send(funcionario)
      .expect(403)
      .end(function (funcionarioSaveErr, funcionarioSaveRes) {
        // Call the assertion callback
        done(funcionarioSaveErr);
      });
  });

  it('should not be able to save an Funcionario if no name is provided', function (done) {
    // Invalidate name field
    funcionario.name = '';

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

        // Save a new Funcionario
        agent.post('/api/funcionarios')
          .send(funcionario)
          .expect(400)
          .end(function (funcionarioSaveErr, funcionarioSaveRes) {
            // Set message assertion
            (funcionarioSaveRes.body.message).should.match('Please fill Funcionario name');

            // Handle Funcionario save error
            done(funcionarioSaveErr);
          });
      });
  });

  it('should be able to update an Funcionario if signed in', function (done) {
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

        // Save a new Funcionario
        agent.post('/api/funcionarios')
          .send(funcionario)
          .expect(200)
          .end(function (funcionarioSaveErr, funcionarioSaveRes) {
            // Handle Funcionario save error
            if (funcionarioSaveErr) {
              return done(funcionarioSaveErr);
            }

            // Update Funcionario name
            funcionario.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Funcionario
            agent.put('/api/funcionarios/' + funcionarioSaveRes.body._id)
              .send(funcionario)
              .expect(200)
              .end(function (funcionarioUpdateErr, funcionarioUpdateRes) {
                // Handle Funcionario update error
                if (funcionarioUpdateErr) {
                  return done(funcionarioUpdateErr);
                }

                // Set assertions
                (funcionarioUpdateRes.body._id).should.equal(funcionarioSaveRes.body._id);
                (funcionarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Funcionarios if not signed in', function (done) {
    // Create new Funcionario model instance
    var funcionarioObj = new Funcionario(funcionario);

    // Save the funcionario
    funcionarioObj.save(function () {
      // Request Funcionarios
      request(app).get('/api/funcionarios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Funcionario if not signed in', function (done) {
    // Create new Funcionario model instance
    var funcionarioObj = new Funcionario(funcionario);

    // Save the Funcionario
    funcionarioObj.save(function () {
      request(app).get('/api/funcionarios/' + funcionarioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', funcionario.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Funcionario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/funcionarios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Funcionario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Funcionario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Funcionario
    request(app).get('/api/funcionarios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Funcionario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Funcionario if signed in', function (done) {
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

        // Save a new Funcionario
        agent.post('/api/funcionarios')
          .send(funcionario)
          .expect(200)
          .end(function (funcionarioSaveErr, funcionarioSaveRes) {
            // Handle Funcionario save error
            if (funcionarioSaveErr) {
              return done(funcionarioSaveErr);
            }

            // Delete an existing Funcionario
            agent.delete('/api/funcionarios/' + funcionarioSaveRes.body._id)
              .send(funcionario)
              .expect(200)
              .end(function (funcionarioDeleteErr, funcionarioDeleteRes) {
                // Handle funcionario error error
                if (funcionarioDeleteErr) {
                  return done(funcionarioDeleteErr);
                }

                // Set assertions
                (funcionarioDeleteRes.body._id).should.equal(funcionarioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Funcionario if not signed in', function (done) {
    // Set Funcionario user
    funcionario.user = user;

    // Create new Funcionario model instance
    var funcionarioObj = new Funcionario(funcionario);

    // Save the Funcionario
    funcionarioObj.save(function () {
      // Try deleting Funcionario
      request(app).delete('/api/funcionarios/' + funcionarioObj._id)
        .expect(403)
        .end(function (funcionarioDeleteErr, funcionarioDeleteRes) {
          // Set message assertion
          (funcionarioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Funcionario error error
          done(funcionarioDeleteErr);
        });

    });
  });

  it('should be able to get a single Funcionario that has an orphaned user reference', function (done) {
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

          // Save a new Funcionario
          agent.post('/api/funcionarios')
            .send(funcionario)
            .expect(200)
            .end(function (funcionarioSaveErr, funcionarioSaveRes) {
              // Handle Funcionario save error
              if (funcionarioSaveErr) {
                return done(funcionarioSaveErr);
              }

              // Set assertions on new Funcionario
              (funcionarioSaveRes.body.name).should.equal(funcionario.name);
              should.exist(funcionarioSaveRes.body.user);
              should.equal(funcionarioSaveRes.body.user._id, orphanId);

              // force the Funcionario to have an orphaned user reference
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

                    // Get the Funcionario
                    agent.get('/api/funcionarios/' + funcionarioSaveRes.body._id)
                      .expect(200)
                      .end(function (funcionarioInfoErr, funcionarioInfoRes) {
                        // Handle Funcionario error
                        if (funcionarioInfoErr) {
                          return done(funcionarioInfoErr);
                        }

                        // Set assertions
                        (funcionarioInfoRes.body._id).should.equal(funcionarioSaveRes.body._id);
                        (funcionarioInfoRes.body.name).should.equal(funcionario.name);
                        should.equal(funcionarioInfoRes.body.user, undefined);

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
      Funcionario.remove().exec(done);
    });
  });
});
