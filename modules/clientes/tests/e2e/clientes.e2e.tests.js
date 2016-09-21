'use strict';

describe('Clientes E2E Tests:', function () {
  describe('Test Clientes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/clientes');
      expect(element.all(by.repeater('cliente in clientes')).count()).toEqual(0);
    });
  });
});
