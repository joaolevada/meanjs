(function () {
  'use strict';

  angular
    .module('contratos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Contratos',
      state: 'contratos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'contratos', {
      title: 'List Contratos',
      state: 'contratos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'contratos', {
      title: 'Create Contrato',
      state: 'contratos.create',
      roles: ['user']
    });
  }
}());
