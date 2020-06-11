(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('UsersController', UsersCtrl);

	function UsersCtrl(Users, UserTypes, UsersByUser, Sites, PasswordService, DepotFiles, SERVER_URL, jwtHelper, $localStorage, alertService, $rootScope, $state, $stateParams, $filter, $q, $log, NgTableParams){
		var vm = this;
        vm.newUser = new Users();
        vm.loading = false;
        vm.queryUserTypes = function(){
            UserTypes.query().$promise.then(function (response) {
                vm.user_types = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        vm.querySites = function () {
            Sites.query().$promise.then(function (response) {
                vm.sites = response;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        vm.queryUserTypes();
        vm.querySites();
        vm.queryUsers = function(){
            vm.loading = true;
            var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
                UsersByUser.query({user_id: tokenPayload.user_id}).$promise.then(function(response){
                    vm.users = response;
                    vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.users});
                    vm.loading = false;
                }).catch(function(response){
                    vm.alerta("danger","Sorry, Something went wrog");
                    vm.loading = false;
                    $log.info(response);
                });
        }
        vm.getUser = function(){
            Users.get({id: $stateParams.id}).$promise.then(function(response){
                vm.editUser = new Users();
                vm.editUser = response;
                vm.editUser.phone = parseInt(vm.editUser.phone);
                /*DepotFiles.query({owner:vm.editUser.id}).$promise.then(function(file){
                    if(file.id){
                        vm.editProfileFile = file;
                        vm.downloadFileURL = SERVER_URL.PROD+'/depot_files/'+vm.editProfileFile.id;
                    }
                });*/
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        }
        vm.saveUser = function(form){
            vm.loading = true;
            if(!vm.newUser.synagogue_id){
                var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
                vm.newUser.synagogue_id=tokenPayload.synagogue_id;
            }
            var dataToSend = angular.toJson({"user":vm.newUser});
            Users.save(dataToSend).$promise.then(function(){
                vm.newUser = new Users();
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! User added");
            }).catch(function(response){
                vm.loading = false;
                if(response.status==400 || response.status==500){
                    vm.alerta("danger","Please, try a diferent email.");
                }else{
                    vm.alerta("danger","Sorry, Something went wrog");
                }
                $log.info(response);
            });
        };
        
        vm.updateUser = function(form){
            Users.update({ id:vm.editUser.id }, vm.editUser).$promise.then(function(){
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Success! User updated");
            }).catch(function(response){
                if(response.status==400 || response.status==500){
                    vm.alerta("danger","Please, Try another email");
                }else{
                    vm.alerta("danger","Sorry, Something went wrog");
                }
                vm.loading = false;
            });
        };
        
        vm.updatePassword = function(form){
            if(vm.password === vm.password_confirmation){
                vm.loadingPassword = true;
                PasswordService.save({ id:vm.editUser.id , newpassword: vm.password}).$promise.then(function(){
                    vm.loadingPassword = false;
                    form.$setPristine();
                    vm.alerta("success","Success! password updated");
                }).catch(function(response){
                    vm.alerta("danger","Sorry, Something went wrog");
                    vm.loadingPassword = false;
                    $log.info(response);
                });
            }
            else{
                vm.alerta("warning","Opps, New passwords don't match");
            }
        };
        
        vm.deleteUser = function(thisUser){
             Users.destroy({id:thisUser.id}).$promise.then(function(){
                 vm.alerta("success","User deleted");
                 var index = vm.users.indexOf(thisUser);
                 vm.users.splice(index, 1);
                 vm.tableParams = new NgTableParams({page: 1, count: 6}, {counts: [], dataset: vm.users});
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