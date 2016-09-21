(function () {
  'use strict';

  angular
    .module('clientes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clientes', {
        abstract: true,
        url: '/clientes',
        template: '<ui-view/>'
      })
      .state('clientes.list', {
        url: '',
        templateUrl: 'modules/clientes/client/views/list-clientes.client.view.html',
        controller: 'ClientesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clientes List'
        }
      })
      .state('clientes.create', {
        url: '/create',
        templateUrl: 'modules/clientes/client/views/form-cliente.client.view.html',
        controller: 'ClientesController',
        controllerAs: 'vm',
        resolve: {
          clienteResolve: newCliente
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Clientes Create'
        }
      })
      .state('clientes.edit', {
        url: '/:clienteId/edit',
        templateUrl: 'modules/clientes/client/views/form-cliente.client.view.html',
        controller: 'ClientesController',
        controllerAs: 'vm',
        resolve: {
          clienteResolve: getCliente
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cliente {{ clienteResolve.nome }}'
        }
      })
      .state('clientes.view', {
        url: '/:clienteId',
        templateUrl: 'modules/clientes/client/views/view-cliente.client.view.html',
        controller: 'ClientesController',
        controllerAs: 'vm',
        resolve: {
          clienteResolve: getCliente
        },
        data: {
          pageTitle: 'Cliente {{ clienteResolve.nome }}'
        }
      });
  }

  getCliente.$inject = ['$stateParams', 'ClientesService'];

  function getCliente($stateParams, ClientesService) {
    return ClientesService.get({
      clienteId: $stateParams.clienteId
    }).$promise;
  }

  newCliente.$inject = ['ClientesService'];

  function newCliente(ClientesService) {
    return new ClientesService();
  }

}());
