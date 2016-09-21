(function () {
  'use strict';

  // Contratos controller
  angular
    .module('contratos')
    .controller('ContratosController', ContratosController);

  ContratosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'contratoResolve'];

  function ContratosController ($scope, $state, $window, Authentication, contrato) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contrato = contrato;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contrato
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contrato.$remove($state.go('contratos.list'));
      }
    }

    // Save Contrato
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contratoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contrato._id) {
        vm.contrato.$update(successCallback, errorCallback);
      } else {
        vm.contrato.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contratos.view', {
          contratoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
