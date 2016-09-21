(function () {
  'use strict';

  angular
    .module('contratos')
    .controller('ContratosListController', ContratosListController);

  ContratosListController.$inject = ['ContratosService'];

  function ContratosListController(ContratosService) {
    var vm = this;

    vm.contratos = ContratosService.query();
  }
}());
