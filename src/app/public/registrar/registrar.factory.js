(function(){
	'use strict';
	angular
		.module('minyan')
        .factory('DefaultUserType',getDefaultUserType)
        .factory('AdminUserType',getAdminUserType);

	function getDefaultUserType($resource, SERVER_URL){
		return $resource( SERVER_URL.PROD +'/defaultUserType');
    }
    function getAdminUserType($resource, SERVER_URL){
		return $resource( SERVER_URL.PROD +'/adminUserType');
    }
})();