(function () {
  'use strict';

  describe('Clientes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClientesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClientesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClientesService = _ClientesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('clientes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/clientes');
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
          ClientesController,
          mockCliente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('clientes.view');
          $templateCache.put('modules/clientes/client/views/view-cliente.client.view.html', '');

          // create mock Cliente
          mockCliente = new ClientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cliente Name'
          });

          // Initialize Controller
          ClientesController = $controller('ClientesController as vm', {
            $scope: $scope,
            clienteResolve: mockCliente
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:clienteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.clienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            clienteId: 1
          })).toEqual('/clientes/1');
        }));

        it('should attach an Cliente to the controller scope', function () {
          expect($scope.vm.cliente._id).toBe(mockCliente._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/clientes/client/views/view-cliente.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClientesController,
          mockCliente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('clientes.create');
          $templateCache.put('modules/clientes/client/views/form-cliente.client.view.html', '');

          // create mock Cliente
          mockCliente = new ClientesService();

          // Initialize Controller
          ClientesController = $controller('ClientesController as vm', {
            $scope: $scope,
            clienteResolve: mockCliente
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.clienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/clientes/create');
        }));

        it('should attach an Cliente to the controller scope', function () {
          expect($scope.vm.cliente._id).toBe(mockCliente._id);
          expect($scope.vm.cliente._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/clientes/client/views/form-cliente.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClientesController,
          mockCliente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('clientes.edit');
          $templateCache.put('modules/clientes/client/views/form-cliente.client.view.html', '');

          // create mock Cliente
          mockCliente = new ClientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cliente Name'
          });

          // Initialize Controller
          ClientesController = $controller('ClientesController as vm', {
            $scope: $scope,
            clienteResolve: mockCliente
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:clienteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.clienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            clienteId: 1
          })).toEqual('/clientes/1/edit');
        }));

        it('should attach an Cliente to the controller scope', function () {
          expect($scope.vm.cliente._id).toBe(mockCliente._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/clientes/client/views/form-cliente.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
