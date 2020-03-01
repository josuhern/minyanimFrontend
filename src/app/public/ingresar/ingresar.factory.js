(function(){
	'use strict';
	angular
		.module('minyan')
		.factory('AuthService',loginFunction);

	function loginFunction($resource,SERVER_URL){
		return $resource( SERVER_URL.PROD +'/authenticate');
	}
})();