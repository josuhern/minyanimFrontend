(function(){
	'use strict';
	angular
		.module('minyan')
		.factory('Users',UsersFunction)
        .factory('UsersByUser',getUsersByUserFunction)
        .factory('ActiveUsers',activeUsersFunction);

    
	function UsersFunction($resource, SERVER_URL, jwtHelper, $localStorage){
		var oAuth = $localStorage.currentUser;
        return $resource(SERVER_URL.PROD+'/users/:id', {id:'@myid'},{
            'get': {method: 'GET', headers: { 'Authorization': oAuth } },
            'save': {method: 'POST', headers: { 'Authorization': oAuth } },
            'query': {method: 'GET',isArray: true, headers: { 'Authorization': oAuth } },
            'update': {method:'PUT', headers: { 'Authorization': oAuth } },
            'destroy': {method: 'DELETE', headers: { 'Authorization': oAuth } }
        });
	}
	function getUsersByUserFunction($resource, SERVER_URL, jwtHelper, $localStorage){
		var oAuth = $localStorage.currentUser;
        return $resource(SERVER_URL.PROD+'/usersByUser/:id', {id:'@myid'},{
            'get': {method: 'GET', headers: { 'Authorization': oAuth } },
            'save': {method: 'POST', headers: { 'Authorization': oAuth } },
            'query': {method: 'GET', isArray: true, headers: { 'Authorization': oAuth } },
            'update': {method:'PUT', headers: { 'Authorization': oAuth } },
            'destroy': {method: 'DELETE', headers: { 'Authorization': oAuth } }
        });
    }
    function activeUsersFunction($resource, SERVER_URL, jwtHelper, $localStorage){
		var oAuth = $localStorage.currentUser;
        return $resource(SERVER_URL.PROD+'/activeUsers/:id', {id:'@myid'},{
            'get': {method: 'GET', headers: { 'Authorization': oAuth } },
            'save': {method: 'POST', headers: { 'Authorization': oAuth } },
            'query': {method: 'GET', isArray: true, headers: { 'Authorization': oAuth } },
            'update': {method:'PUT', headers: { 'Authorization': oAuth } },
            'destroy': {method: 'DELETE', headers: { 'Authorization': oAuth } }
        });
    }
})();