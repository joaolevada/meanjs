(function () {
  'use strict';

  // Funcionarios controller
  angular
    .module('funcionarios')
    .controller('FuncionariosController', FuncionariosController);

  FuncionariosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'funcionarioResolve'];

  function FuncionariosController ($scope, $state, $window, Authentication, funcionario) {
    var vm = this;

    vm.authentication = Authentication;
    vm.funcionario = funcionario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Funcionario
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.funcionario.$remove($state.go('funcionarios.list'));
      }
    }

    // Save Funcionario
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.funcionarioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.funcionario._id) {
        vm.funcionario.$update(successCallback, errorCallback);
      } else {
        vm.funcionario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('funcionarios.view', {
          funcionarioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
