'use strict';

describe('Contratos E2E Tests:', function () {
  describe('Test Contratos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contratos');
      expect(element.all(by.repeater('contrato in contratos')).count()).toEqual(0);
    });
  });
});
