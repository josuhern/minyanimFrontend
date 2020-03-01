(function () {
	'use strict';
	angular
		.module('minyan')
		.factory('Auth', authFunction);

    function authFunction(jwtHelper, $localStorage) {
        if (angular.isDefined($localStorage.currentUser)){
            var bool = jwtHelper.isTokenExpired($localStorage.currentUser);
            return { isLoggedIn : !bool};
        } else {
            return { isLoggedIn : false};
        }
	}
})();