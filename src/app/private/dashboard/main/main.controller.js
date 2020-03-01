(function() {
  'use strict';

  angular
    .module('minyan')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Users, alertService, $rootScope, jwtHelper, $localStorage, SERVER_URL, $log){
    var vm = this;
                
        vm.getUser = function(){
            vm.tokenUser = jwtHelper.decodeToken($localStorage.currentUser);
            Users.get({id: vm.tokenUser.user_id}).$promise.then(function(response){
                vm.editUser = new Users();
                vm.editUser = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }
        
        vm.alerta = function(tipo, message) {
            alertService.add(tipo, message, 4000);
        };
        $rootScope.closeAlert = alertService.closeAlert; 
  }
})();
