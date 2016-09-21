(function () {
  'use strict';

  angular
    .module('funcionarios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('funcionarios', {
        abstract: true,
        url: '/funcionarios',
        template: '<ui-view/>'
      })
      .state('funcionarios.list', {
        url: '',
        templateUrl: 'modules/funcionarios/client/views/list-funcionarios.client.view.html',
        controller: 'FuncionariosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Funcionarios List'
        }
      })
      .state('funcionarios.create', {
        url: '/create',
        templateUrl: 'modules/funcionarios/client/views/form-funcionario.client.view.html',
        controller: 'FuncionariosController',
        controllerAs: 'vm',
        resolve: {
          funcionarioResolve: newFuncionario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Funcionarios Create'
        }
      })
      .state('funcionarios.edit', {
        url: '/:funcionarioId/edit',
        templateUrl: 'modules/funcionarios/client/views/form-funcionario.client.view.html',
        controller: 'FuncionariosController',
        controllerAs: 'vm',
        resolve: {
          funcionarioResolve: getFuncionario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Funcionario {{ funcionarioResolve.name }}'
        }
      })
      .state('funcionarios.view', {
        url: '/:funcionarioId',
        templateUrl: 'modules/funcionarios/client/views/view-funcionario.client.view.html',
        controller: 'FuncionariosController',
        controllerAs: 'vm',
        resolve: {
          funcionarioResolve: getFuncionario
        },
        data: {
          pageTitle: 'Funcionario {{ funcionarioResolve.name }}'
        }
      });
  }

  getFuncionario.$inject = ['$stateParams', 'FuncionariosService'];

  function getFuncionario($stateParams, FuncionariosService) {
    return FuncionariosService.get({
      funcionarioId: $stateParams.funcionarioId
    }).$promise;
  }

  newFuncionario.$inject = ['FuncionariosService'];

  function newFuncionario(FuncionariosService) {
    return new FuncionariosService();
  }
}());
