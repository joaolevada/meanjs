(function () {
  'use strict';

  // Clientes controller
  angular
    .module('clientes')
    .controller('ClientesController', ClientesController);

  ClientesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'clienteResolve'];

  function ClientesController ($scope, $state, $window, Authentication, cliente) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cliente = cliente;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cliente
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cliente.$remove($state.go('clientes.list'));
      }
    }

    // Save Cliente
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clienteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cliente._id) {
        vm.cliente.$update(successCallback, errorCallback);
      } else {
        vm.cliente.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('clientes.view', {
          clienteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
