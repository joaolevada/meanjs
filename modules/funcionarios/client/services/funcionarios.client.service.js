// Funcionarios service used to communicate Funcionarios REST endpoints
(function () {
  'use strict';

  angular
    .module('funcionarios')
    .factory('FuncionariosService', FuncionariosService);

  FuncionariosService.$inject = ['$resource'];

  function FuncionariosService($resource) {
    return $resource('api/funcionarios/:funcionarioId', {
      funcionarioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
