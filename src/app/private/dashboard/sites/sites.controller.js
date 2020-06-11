(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('SitesController', SitesCtrl);

	function SitesCtrl(Sites, alertService, $rootScope, $state, $stateParams, jwtHelper, $localStorage, $filter, $q, NgTableParams, $log){
		var vm = this;
        vm.newSites = new Sites();
        vm.loading = false;
        vm.querySites = function () {
            vm.loading = true;
            Sites.query().$promise.then(function (response) {
                vm.sites = response;
                vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.sites});
                vm.loading = false;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                vm.loading = false;
                $log.info(response);
            });
        };
        vm.getSite = function(){
            Sites.get({id: $stateParams.id}).$promise.then(function(response){
                vm.editSite = new Sites();
                vm.editSite = response;
                vm.editSite.phone = parseInt(vm.editSite.phone);
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }
        vm.getMySite = function(){
            var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
            Sites.get({id: tokenPayload.synagogue_id}).$promise.then(function(response){
                vm.editSite = new Sites();
                vm.editSite = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }
        vm.saveSite = function(form){
            vm.loading = true;
            var dataToSend = angular.toJson({"synagogue":vm.newSites});
            Sites.save(dataToSend).$promise.then(function(){
                vm.newSites = new Sites();
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! Synagogue added");
            }).catch(function(response){
                vm.loading = false;
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        
        vm.updateSite = function(form){
            Sites.update({ id:vm.editSite.id }, vm.editSite).$promise.then(function(response){
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success!, Synagogue updated");
                $log.info(response);
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                vm.loading = false;
                $log.info(response);
            });
        };
        
        vm.deleteSite = function(thisSite){
             Sites.destroy({id:thisSite.id}).$promise.then(function(){
                 vm.alerta("success","Synagogue deleted");
                 var index = vm.sites.indexOf(thisSite);
                 vm.sites.splice(index, 1);
                 vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.sites});
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