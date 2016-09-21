(function () {
  'use strict';

  describe('Contratos Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContratosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContratosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContratosService = _ContratosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contratos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contratos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ContratosController,
          mockContrato;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contratos.view');
          $templateCache.put('modules/contratos/client/views/view-contrato.client.view.html', '');

          // create mock Contrato
          mockContrato = new ContratosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contrato Name'
          });

          // Initialize Controller
          ContratosController = $controller('ContratosController as vm', {
            $scope: $scope,
            contratoResolve: mockContrato
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contratoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contratoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contratoId: 1
          })).toEqual('/contratos/1');
        }));

        it('should attach an Contrato to the controller scope', function () {
          expect($scope.vm.contrato._id).toBe(mockContrato._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contratos/client/views/view-contrato.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContratosController,
          mockContrato;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contratos.create');
          $templateCache.put('modules/contratos/client/views/form-contrato.client.view.html', '');

          // create mock Contrato
          mockContrato = new ContratosService();

          // Initialize Controller
          ContratosController = $controller('ContratosController as vm', {
            $scope: $scope,
            contratoResolve: mockContrato
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contratoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contratos/create');
        }));

        it('should attach an Contrato to the controller scope', function () {
          expect($scope.vm.contrato._id).toBe(mockContrato._id);
          expect($scope.vm.contrato._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contratos/client/views/form-contrato.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContratosController,
          mockContrato;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contratos.edit');
          $templateCache.put('modules/contratos/client/views/form-contrato.client.view.html', '');

          // create mock Contrato
          mockContrato = new ContratosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contrato Name'
          });

          // Initialize Controller
          ContratosController = $controller('ContratosController as vm', {
            $scope: $scope,
            contratoResolve: mockContrato
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contratoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contratoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contratoId: 1
          })).toEqual('/contratos/1/edit');
        }));

        it('should attach an Contrato to the controller scope', function () {
          expect($scope.vm.contrato._id).toBe(mockContrato._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contratos/client/views/form-contrato.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
