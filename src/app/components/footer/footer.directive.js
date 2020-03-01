(function() {
  'use strict';

  angular
    .module('minyan')
    .directive('acmeFooter', acmeFooter);

  /** @ngInject */
  function acmeFooter() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/footer/footer.html',
      controller: 'FooterController',
      controllerAs: 'myFooter'
    };

    return directive;

  }

})();