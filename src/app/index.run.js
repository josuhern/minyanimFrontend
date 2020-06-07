(function() {
  "use strict";

  angular.module("minyan").run(runBlock);

  /** @ngInject */
  function runBlock(
    $rootScope,
    $document,
    $state,
    $location,
    Auth,
    jwtHelper,
    alertService,
    $localStorage
  ) {
    $rootScope.closeAlert = alertService.closeAlert;
    $rootScope.$state = $state;
    $rootScope.$on("$stateChangeSuccess", function() {
      angular.element("html,body").animate({ scrollTop: 0 }, "slow");
      if(angular.element("#mySidebar")[0]||angular.element("#main")[0]){
        angular.element("#mySidebar")[0].style.width = "0";
        angular.element("#main")[0].style.marginLeft = "0";
        angular.element("#menu1")[0].style.display = "block";
        angular.element("#menu2")[0].style.display = "none";
      }
    });
    $rootScope.$on("$stateChangeStart", function(
      event,
      toState,
      toParams,
      fromState
    ) {
      var shouldLogin =
        angular.isDefined(toState.data) &&
        toState.data.requireLogin &&
        !Auth.isLoggedIn;
      if (shouldLogin) {
        $state.go("home");
        event.preventDefault();
        return;
      }
      var shouldGoToPublic =
        fromState.name === "" &&
        toState.name !== "home" &&
        toState.name !== "ingresar";
      if (shouldGoToPublic) {
        $state.go("home");
        event.preventDefault();
      }
      if (angular.isDefined($localStorage.currentUser)) {
        if (jwtHelper.isTokenExpired($localStorage.currentUser)) {
          var auth = Auth;
          auth.isLoggedIn = false;
          delete $localStorage.currentUser;
          alerta("info", "Por favor, inicia sesión de nuevo");
          $state.go("home");
          event.preventDefault();
        }
      }
    });
    function alerta(tipo, message) {
      alertService.add(tipo, message, 4000);
    }
  }
})();
