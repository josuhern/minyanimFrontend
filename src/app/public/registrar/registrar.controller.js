(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('RegisterController', RegisterCtrl);

	function RegisterCtrl($rootScope, alertService, Sites, Users, DefaultUserType, AdminUserType, CheckEmail, $state, $stateParams, $log){
        var vm = this;
        vm.show=0;
        
        vm.querySites = function () {
            vm.loading = true;
            Sites.query().$promise.then(function (response) {
                vm.sites = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        vm.initRegisterUser = function(){
            vm.newUser = new Users();
            DefaultUserType.get().$promise.then(function(response){
                vm.defaultUserType = new DefaultUserType();
                vm.defaultUserType = response;
                vm.newUser.user_type_id=vm.defaultUserType.id;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
            Sites.get({id: $stateParams.id}).$promise.then(function(response){
                vm.editSite = new Sites();
                vm.editSite = response;
                vm.newUser.synagogue_id=vm.editSite.id;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }

        vm.saveUser = function(form){
            vm.loading = true;
            var dataToSend = angular.toJson({"user":vm.newUser});
            Users.save(dataToSend).$promise.then(function(){
                vm.newUser = new Users();
                vm.editSite = new Sites();
                vm.defaultUserType = new DefaultUserType();
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! User added, your password has been seed to your email");
                $state.go('login');
                event.preventDefault();
            }).catch(function(response){
                vm.loading = false;
                if(response.status==-1){
                    vm.alerta("danger","Looks like you already have an account.");
                    vm.newUser.email=undefined;
                }else{
                    vm.alerta("danger","Sorry, Something went wrog");
                }
                $log.info(response);
            });
        };

        vm.initRegisterSynagogue = function(){
            vm.userData=1;
            vm.synagogueData=1;
            vm.newUser = new Users();
            AdminUserType.get().$promise.then(function(response){
                vm.adminUserType = new AdminUserType();
                vm.adminUserType = response;
                vm.newUser.user_type_id=vm.adminUserType.id;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
            vm.newSites = new Sites();
        }

        vm.saveAdminSynagogue = function(form){
            vm.loading = true;
            $log.info(vm.newSites);
            $log.info(vm.newUser);
            CheckEmail.get({email: vm.newUser.email}).$promise.then(function(response){
                if(response.exist==true){
                    vm.alerta("danger","That user is already in use");
                    vm.newUser.email=undefined;
                    vm.loading = false;
                }else{
                    var dataToSend = angular.toJson({"synagogue":vm.newSites});
                    Sites.save(dataToSend).$promise.then(function(response){
                        vm.newUser.synagogue_id = response.id;
                        var dataUserToSend = angular.toJson({"user":vm.newUser});
                        Users.save(dataUserToSend).$promise.then(function(){
                            vm.newUser = new Users();
                            vm.newSites = new Sites();
                            vm.adminUserType = new AdminUserType();
                            form.$setPristine();
                            vm.loading = false;
                            vm.alerta("success","Success! Synagogue and admin user added, your password has been seed to your email");
                            $state.go('login');
                            event.preventDefault();
                        }).catch(function(response){
                            vm.loading = false;
                            if(response.status==400 || response.status==500){
                                vm.alerta("danger","Please, try a diferent email.");
                            }else{
                                vm.alerta("danger","Sorry, Something went wrog");
                            }
                            $log.info(response);
                        });
                    }).catch(function(response){
                        vm.loading = false;
                        vm.alerta("danger","Sorry, Something went wrog");
                        $log.info(response);
                    });
                }
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