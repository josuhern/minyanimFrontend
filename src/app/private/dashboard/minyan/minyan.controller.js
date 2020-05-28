(function() {
    'use strict';
  
    angular
      .module('minyan')
      .controller('MinyanController', MinyanController);
  
    /** @ngInject */
    function MinyanController(Minyan, TodayPrays, Attendance, $filter, alertService, $rootScope, jwtHelper, $localStorage, SERVER_URL, $log, $interval){
      var vm = this;
      vm.tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
      vm.viewDate = new Date();
      vm.getTodayPrays = function () {
        vm.loading = true;
        TodayPrays.query({ synagogue_id: vm.tokenPayload.synagogue_id, timezome: Intl.DateTimeFormat().resolvedOptions().timeZone })
          .$promise.then(function (response) {
            vm.prays = response;
            angular.forEach(vm.prays, function (value) {
              var thisDate = new Date(value.date);
              if(vm.viewDate > thisDate){
                value.open = false;
                value.disabled = true;
                value.class = "panel-claro";
              }else{
                value.open = true;
                value.disabled = false;
                value.class = "panel-oscuro";
              }
            });
            vm.loading = false;
            vm.updateAttendance();
          })
          .catch(function (response) {
            vm.alerta("danger", "Sorry, Something went wrog");
            vm.loading = false;
            $log.info(response);
          });
      };

      vm.updateAttendance = function(){
        angular.forEach(vm.prays, function (value) {
          Attendance.query({pray_id: value.id}).$promise.then(function (response) {
            value.Attendance=response;
            value.minyan = $filter('filter')(value.Attendance, {status: 1}).length;
          })
        });
      }

      $interval(function() {
        vm.viewDate = new Date();
        angular.forEach(vm.prays, function (value) {
          Attendance.query({pray_id: value.id}).$promise.then(function (response) {
            value.Attendance=response;
            value.minyan = $filter('filter')(value.Attendance, {status: 1}).length;
          })
        });
      },1000);

      vm.saveMinyan = function(pray_id, status){
        vm.loading = true;
        vm.newMinyan = new Minyan();
        vm.newMinyan.user_id = vm.tokenPayload.user_id;
        vm.newMinyan.pray_id = pray_id;
        vm.newMinyan.status = status;
        var dataToSend = angular.toJson({"minyanim":vm.newMinyan});
        Minyan.save(dataToSend).$promise.then(function(){
            vm.newMinyan = new Minyan();
            vm.loading = false;
            vm.alerta("success","Success! Your status has been updated");
            vm.updateAttendance();
        }).catch(function(response){
            vm.loading = false;
            vm.alerta("danger","Sorry, Something went wrog");
            $log.info(response);
        });
    };

    vm.getAttendance = function(id){
      Attendance.query({pray_id: id})
        .$promise.then(function (response) {
          return response;
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          $log.info(response);
        });
    }
          
          vm.alerta = function(tipo, message) {
              alertService.add(tipo, message, 4000);
          };
          $rootScope.closeAlert = alertService.closeAlert; 
    }
  })();
  