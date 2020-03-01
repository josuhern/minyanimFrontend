(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('ForgotPasswordController', ForgotPasswordCtrl);

	function ForgotPasswordCtrl($rootScope, ForgotPassword, alertService){
		var vm = this;
		vm.loading = false;
		vm.sendPasswordEmail = function(form) {
            vm.loading= true;
			ForgotPassword.save({email: vm.email}).$promise.then(function(){
                form.$setPristine();
                vm.loading= false;
                vm.alerta("success","Hemos enviado una contraseña nueva a tu correo electrónico, gracias");
                vm.email = undefined;
            }).catch(function(response){
                if(response.status==401 || response.status==500){
                    vm.loading= false;
                    vm.alerta("danger","Tu correo electrónico es incorrecto");
                }
            });
		};
        vm.alerta = function(tipo, message) {
            alertService.add(tipo, message, 4000);
        };
        $rootScope.closeAlert = alertService.closeAlert; 
	}
})();