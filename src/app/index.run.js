(function() {
  'use strict';

  angular
    .module('minyan')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $document, $state, $location, Auth, jwtHelper, alertService, $localStorage) {
      $rootScope.closeAlert = alertService.closeAlert; 
      $rootScope.$state = $state;
      $rootScope.$on('$stateChangeSuccess', function() {
         angular.element('html,body').animate({scrollTop:0},'slow');
      });
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
          var shouldLogin = angular.isDefined(toState.data) && toState.data.requireLogin  && !Auth.isLoggedIn;
          if(shouldLogin){
              $state.go('login');
              event.preventDefault();
              return;
          }
          var shouldGoToPublic = fromState.name === "" && toState.name !== "home" && toState.name !== "ingresar" ;
          if(shouldGoToPublic){
              $state.go('home');
              event.preventDefault();
          }
          if (angular.isDefined($localStorage.currentUser)){
              if (jwtHelper.isTokenExpired($localStorage.currentUser)) {
                var auth = Auth;
                auth.isLoggedIn=false;
                delete $localStorage.currentUser;
                alerta("info","Por favor, inicia sesión de nuevo");
                $state.go('ingresar');
                event.preventDefault();
              }
          }
      });
      function alerta(tipo, message) {
            alertService.add(tipo, message, 4000);
      }
  }

})();
