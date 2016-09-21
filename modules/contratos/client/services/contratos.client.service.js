// Contratos service used to communicate Contratos REST endpoints
(function () {
  'use strict';

  angular
    .module('contratos')
    .factory('ContratosService', ContratosService);

  ContratosService.$inject = ['$resource'];

  function ContratosService($resource) {
    return $resource('api/contratos/:contratoId', {
      contratoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
