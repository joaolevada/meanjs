(function () {
  'use strict';

  angular
    .module('funcionarios')
    .controller('FuncionariosListController', FuncionariosListController);

  FuncionariosListController.$inject = ['FuncionariosService'];

  function FuncionariosListController(FuncionariosService) {
    var vm = this;

    vm.funcionarios = FuncionariosService.query();
  }
}());
