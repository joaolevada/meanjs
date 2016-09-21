// Clientes service used to communicate Clientes REST endpoints
(function () {
  'use strict';

  angular
    .module('clientes')
    .factory('ClientesService', ClientesService);

  ClientesService.$inject = ['$resource'];

  function ClientesService($resource) {
    return $resource('api/clientes/:clienteId', {
      clienteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
