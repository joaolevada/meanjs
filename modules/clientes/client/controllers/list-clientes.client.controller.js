(function () {
  'use strict';

  angular
    .module('clientes')
    .controller('ClientesListController', ClientesListController);

  ClientesListController.$inject = ['ClientesService'];

  function ClientesListController(ClientesService) {
    var vm = this;

    vm.clientes = ClientesService.query();
  }
}());
