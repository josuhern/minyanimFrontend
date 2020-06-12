(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('LoginController', LoginCtrl);

	function LoginCtrl($rootScope, $state, Auth, AuthService, jwtHelper, alertService, $localStorage){
		var vm = this;
        vm.loginService = new AuthService();
        vm.auth = Auth;
		vm.loading = false;
        vm.user ={
			email: "",
			password: ""
		};
        if (angular.isDefined($localStorage.currentUser)){
            $state.go('dashboard.main');
        }
        
		vm.crearSesion = function(loginForm) {
            vm.loading= true;
            vm.loginService.email=vm.user.email;
            vm.loginService.password=vm.user.password;
            
            var dataToSend = angular.toJson(vm.loginService);
			AuthService.save(dataToSend).$promise.then(function(data){
                loginForm.$setPristine();
                vm.loading= false;
                vm.auth.isLoggedIn = true;
                vm.saveToken(data.auth_token);
                $state.go('dashboard.main');
                event.preventDefault();
            }).catch(function(response){
                if(response.status==401 || response.status==500){
                    vm.loading= false;
                    vm.alerta("danger","Email or password are wrong");
                }
            });
		};
        vm.saveToken = function(token) {
            $localStorage.currentUser = token;
            /*var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
            var date = jwtHelper.getTokenExpirationDate($localStorage.currentUser);
            var bool = jwtHelper.isTokenExpired($localStorage.currentUser);*/
        };
        vm.alerta = function(tipo, message) {
            alertService.add(tipo, message, 4000);
        };
        $rootScope.closeAlert = alertService.closeAlert; 
	}
})();