(function() {
    'use strict';
  
    angular
      .module('minyan')
      .controller('SMSController', SMSController);
  
    /** @ngInject */
    function SMSController(ActiveUsers, $filter, alertService, $rootScope, jwtHelper, $localStorage, SERVER_URL, $log){
      var vm = this;
      vm.tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);

      vm.getActiveUser = function(){
        ActiveUsers.query({user_id: vm.tokenPayload.user_id}).$promise.then(function(response){
            vm.activeUsers = response;
            angular.forEach(vm.activeUsers, function (value) {
                value.selected=1;
            });
        }).catch(function(response){
            vm.alerta("danger","Sorry, Something went wrog");
            $log.info(response);
        });
      }

    vm.sendReminder = function(){
        var phoneNumbers = [];
        angular.forEach(vm.activeUsers, function (value) {
            if(value.phone.length>=10 && value.selected==1)
                phoneNumbers.push(value.phone);
        });
        var smsResponse = sendSMS(phoneNumbers, vm.message);
        if(smsResponse){
            vm.alerta("success","All right, message sent");
            vm.message = "";
        }
        else
            vm.alerta("danger","Sorry, Something went wrog");
    }

    vm.sendReminderIOS = function(){
        var phoneNumbers = "";
        angular.forEach(vm.activeUsers, function (value, key) {
            if(key==0){
                if(value.phone.length>=10)
                    phoneNumbers = value.phone;
            }else{
                if(value.phone.length>=10)
                    phoneNumbers = phoneNumbers + "," + value.phone;
            }
        });
            var smsResponse = sendIOSSMS(phoneNumbers, vm.message);
            if(smsResponse){
              vm.alerta("success","All right, reminders sent");
              vm.message = "";
            }
            else
              vm.alerta("danger","Sorry, Something went wrog");
        
    };
          
          vm.alerta = function(tipo, message) {
              alertService.add(tipo, message, 4000);
          };
          $rootScope.closeAlert = alertService.closeAlert; 
    }
  })();
  