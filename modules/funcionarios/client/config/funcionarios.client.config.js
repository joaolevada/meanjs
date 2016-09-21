(function () {
  'use strict';

  angular
    .module('funcionarios')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Funcionarios',
      state: 'funcionarios',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'funcionarios', {
      title: 'List Funcionarios',
      state: 'funcionarios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'funcionarios', {
      title: 'Create Funcionario',
      state: 'funcionarios.create',
      roles: ['user']
    });
  }
}());
