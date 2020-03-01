(function(){
	'use strict';
	angular
		.module('minyan')
		.factory('ForgotPassword',forgotPasswordFunction);

	function forgotPasswordFunction($resource,SERVER_URL){
		return $resource( SERVER_URL.PROD +'/forgotPassword');
	}
})();