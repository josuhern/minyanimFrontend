(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('PerfilController', perfilCtrl);

	function perfilCtrl(Users, UserTypes, PasswordService, alertService, $rootScope, jwtHelper, $localStorage, Upload, DepotFiles, UniqueFile, SERVER_URL, $log){
		var vm = this;
        
        /*FILE UPLOAD*/
        
        vm.uploadFile = function(file) {
          vm.newFile = {
            depot_file: {
              owner_id: '',
              file: file,
              file_name: file.name,
              originalName: file.name,
              location: 'profile'
            },
            file_name: file.name
          };
        };
        vm.saveFile = function(id){
          vm.newFile.depot_file.owner_id = id;
          vm.newFile.depot_file.originalName = id;
          Upload.upload({url: SERVER_URL.PROD+'/depot_files', data: vm.newFile, headers: {"Authorization": $localStorage.currentUser}}).then(function (response){
              $log.info(response);
          });
        };
        
        vm.deleteFile = function(thisFileID){
            vm.loadingImage = true;
            DepotFiles.destroy({id:thisFileID}).$promise.then(function(){
                vm.alerta("success","La imagen fue eliminado");
                vm.editProfileFile = undefined;
                vm.loadingImage = false;
            });
        };
        vm.updateFile = function(ownerID){
            vm.loadingImage = true;
            vm.newFile.depot_file.owner_id = ownerID;
            vm.newFile.depot_file.originalName = ownerID;
            Upload.upload({url: SERVER_URL.PROD+'/depot_files', data: vm.newFile, headers: {"Authorization": $localStorage.currentUser}}).then(function (response){
                vm.editProfileFile = response.data;
                vm.downloadFileURL = SERVER_URL.PROD+'/depot_files/'+vm.editProfileFile.id;
                vm.loadingImage = false;
                vm.myFile=null;
                vm.alerta("success","Felicidades, La imagen fue actualizada exitosamente!");
            });
        }
        
        /*FILE UPLOAD*/
        /*vm.queryUserTypes = function () {
            UserTypes.query().$promise.then(function (response) {
                vm.user_types = response.user_types;
            }).catch(function(response){
                vm.alerta("danger","Sorry, Something went wrog");
                $log.info(response);
            });
        };
        vm.queryUserTypes();
        */
        
        vm.getUser = function(){
            vm.tokenUser = jwtHelper.decodeToken($localStorage.currentUser);
            Users.get({id: vm.tokenUser.user_id}).$promise.then(function(response){
                vm.editUser = new Users();
                vm.editUser = response;
                /*UniqueFile.get({owner:vm.editUser.id}).$promise.then(function(file){
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
        
        vm.updateUser = function(form){
            Users.update({ id:vm.editUser.id }, vm.editUser).$promise.then(function(response){
                form.$setPristine();
                vm.loading = false;
                vm.alerta("success","Felicidades, Usuario actualizado exitosamente!");
                $log.info(response);
            }).catch(function(response){
                if(response.status==400 || response.status==500){
                    vm.alerta("danger","Error! el correo ya existe.");
                }else{
                    vm.alerta("danger","Sorry, Something went wrog");
                }
                vm.loading = false;
                $log.info(response);
            });
        };
        
        vm.updatePassword = function(form){
            if(vm.password === vm.password_confirmation){
                vm.loadingPassword = true;
                PasswordService.save({ id:vm.editUser.id , newpassword: vm.password}).$promise.then(function(){
                    vm.loadingPassword = false;
                    form.$setPristine();
                    vm.alerta("success","Felicidades, Contraseña actualizada correctamente!");
                    vm.password = undefined;
                    vm.password_confirmation = undefined;
                }).catch(function(response){
                    vm.alerta("danger","Sorry, Something went wrog");
                    vm.loadingPassword = false;
                    $log.info(response);
                });
            }
            else{
                vm.alerta("warning","Opps, las contraseñas no coinciden!");
            }
        };
        
        vm.alerta = function(tipo, message) {
            alertService.add(tipo, message, 4000);
        };
        $rootScope.closeAlert = alertService.closeAlert; 
	}
})();