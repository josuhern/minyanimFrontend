(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('UserTypesController', UserTypesCtrl);

	function UserTypesCtrl(UserTypes, alertService, $rootScope, $state, $stateParams, $filter, $q, NgTableParams, $log){
		var vm = this;
        vm.newUserTypes = new UserTypes();
        vm.loading = false;
        vm.queryUserTypes = function () {
            vm.loading = true;
            UserTypes.query().$promise.then(function (response) {
                vm.user_types = response;
                vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.user_types});
                vm.loading = false;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                vm.loading = false;
                $log.info(response);
            });
        };
        vm.getUserType = function(){
            UserTypes.get({id: $stateParams.id}).$promise.then(function(response){
                vm.editUserType = new UserTypes();
                vm.editUserType = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }
        vm.saveUserType = function(form){
            vm.loading = true;
            var dataToSend = angular.toJson({"user_type":vm.newUserTypes});
            UserTypes.save(dataToSend).$promise.then(function(){
                vm.newUserTypes = new UserTypes();
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! User type added");
            }).catch(function(response){
                vm.loading = false;
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        
        vm.updateUserType = function(form){
            UserTypes.update({ id:vm.editUserType.id }, vm.editUserType).$promise.then(function(response){
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! User type edited");
                $log.info(response);
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                vm.loading = false;
                $log.info(response);
            });
        };
        
        vm.deleteUserType = function(thisUserType){
             UserTypes.destroy({id:thisUserType.id}).$promise.then(function(){
                 vm.alerta("success","User type deleted");
                 var index = vm.user_types.indexOf(thisUserType);
                 vm.user_types.splice(index, 1);
                 vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.user_types});
             }).catch(function(response){
                 vm.alerta("danger","Sorry, Something went wrog");
                 $log.info(response);
             }); 
        };
        
        vm.alerta = function(tipo, message) {
            alertService.add(tipo, message, 4000);
        };
        $rootScope.closeAlert = alertService.closeAlert; 
	}
})();