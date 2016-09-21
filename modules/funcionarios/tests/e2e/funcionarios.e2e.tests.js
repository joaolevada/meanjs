'use strict';

describe('Funcionarios E2E Tests:', function () {
  describe('Test Funcionarios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/funcionarios');
      expect(element.all(by.repeater('funcionario in funcionarios')).count()).toEqual(0);
    });
  });
});
