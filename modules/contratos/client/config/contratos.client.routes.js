(function () {
  'use strict';

  angular
    .module('contratos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contratos', {
        abstract: true,
        url: '/contratos',
        template: '<ui-view/>'
      })
      .state('contratos.list', {
        url: '',
        templateUrl: 'modules/contratos/client/views/list-contratos.client.view.html',
        controller: 'ContratosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contratos List'
        }
      })
      .state('contratos.create', {
        url: '/create',
        templateUrl: 'modules/contratos/client/views/form-contrato.client.view.html',
        controller: 'ContratosController',
        controllerAs: 'vm',
        resolve: {
          contratoResolve: newContrato
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Contratos Create'
        }
      })
      .state('contratos.edit', {
        url: '/:contratoId/edit',
        templateUrl: 'modules/contratos/client/views/form-contrato.client.view.html',
        controller: 'ContratosController',
        controllerAs: 'vm',
        resolve: {
          contratoResolve: getContrato
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contrato {{ contratoResolve.name }}'
        }
      })
      .state('contratos.view', {
        url: '/:contratoId',
        templateUrl: 'modules/contratos/client/views/view-contrato.client.view.html',
        controller: 'ContratosController',
        controllerAs: 'vm',
        resolve: {
          contratoResolve: getContrato
        },
        data: {
          pageTitle: 'Contrato {{ contratoResolve.name }}'
        }
      });
  }

  getContrato.$inject = ['$stateParams', 'ContratosService'];

  function getContrato($stateParams, ContratosService) {
    return ContratosService.get({
      contratoId: $stateParams.contratoId
    }).$promise;
  }

  newContrato.$inject = ['ContratosService'];

  function newContrato(ContratosService) {
    return new ContratosService();
  }
}());
