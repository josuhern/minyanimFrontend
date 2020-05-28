(function () {
  "use strict";
  angular.module("minyan").controller("PraysController", PraysCtrl);

  function PraysCtrl(
    Prays,
    PraysBySynagogue,
    alertService,
    $rootScope,
    $state,
    $stateParams,
    $filter,
    jwtHelper,
    $localStorage,
    $q,
    NgTableParams,
    $log
  ) {
    var vm = this;
    vm.newPrays = new Prays();

    
    vm.loading = false;
    vm.special = 0;
    vm.tokenUser = jwtHelper.decodeToken($localStorage.currentUser);
    vm.changeSpecial = function (newVal) {
      vm.special = newVal;
    };
    vm.changeEditSpecial = function (newVal) {
      vm.editPray.special = newVal;
    };
    vm.today = new Date();
    vm.yesterday = new Date(
      vm.today.getFullYear(),
      vm.today.getMonth(),
      vm.today.getDate()-1,
      23,
      59,
      59
    );
    
    vm.newPrays.from = vm.today;
    vm.newPrays.to = new Date();
    vm.newPrays.to.setDate(vm.today.getDate() + 1);
    vm.newPrays.hour = new Date(
      vm.today.getFullYear(),
      vm.today.getMonth(),
      vm.today.getDate(),
      vm.today.getHours(),
      vm.today.getMinutes(),
      0
    );
    vm.viewDate = new Date();
    vm.calendarView = "day";
    vm.events = [];

    vm.getPraysBySynagogue = function () {
      vm.loading = true;
      var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
      PraysBySynagogue.query({ synagogue_id: tokenPayload.synagogue_id })
        .$promise.then(function (response) {
          vm.prays = response;
          vm.tableParams = new NgTableParams(
            { page: 1, count: 6 },
            { counts: [], dataset: vm.prays }
          );
          vm.loading = false;
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          vm.loading = false;
          $log.info(response);
        });
    };

    vm.eventClicked = function(x){
      $state.go('dashboard.updatePray', {id: x.id});
    }

    vm.queryPrays = function () {
      vm.loading = true;
      var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
      PraysBySynagogue.query({ synagogue_id: tokenPayload.synagogue_id })
        .$promise.then(function (response) {
          vm.prays = response;
          angular.forEach(vm.prays, function (value) {
            var start = new Date(value.date);
            var end = new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate(),
              start.getHours() + 1,
              start.getMinutes(),
              0
            );
            var thisPray = {
              id: value.id,
              title: value.name,
              startsAt: start, // A javascript date object for when the event starts
              endsAt: end, // Optional - a javascript date object for when the event ends
              color: {
                primary: "#215c5f", // the primary event color (should be darker than secondary)
                secondary: "#3f7073" // the secondary event color (should be lighter than primary)
              },
              draggable: false, //Allow an event to be dragged and dropped
              resizable: false, //Allow an event to be resizable
              incrementsBadgeTotal: false
            };
            vm.events.push(thisPray);
          });
          vm.loading = false;
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          vm.loading = false;
          $log.info(response);
        });
    };
    vm.getPray = function () {
      Prays.get({ id: $stateParams.id })
        .$promise.then(function (response) {
          vm.editPray = new Prays();
          vm.editPray = response;
          vm.editPray.date = new Date(vm.editPray.date);
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          $log.info(response);
        });
    };

    vm.savePray = function (form) {
      var dataToSend;
      vm.today = new Date();
      if (vm.newPrays.from < vm.yesterday || vm.newPrays.to < vm.yesterday) {
        vm.alerta("warning", "Sorry the dates selected can not be in the past");
        if (vm.newPrays.from <= vm.yesterday )
          vm.newPrays.from=undefined;
        if (vm.newPrays.to <= vm.yesterday )
          vm.newPrays.to=undefined;
        return;
      }
      var fromDate = vm.newPrays.from;
      var toDate = vm.newPrays.to;
      if (!vm.special) {
        vm.loading = true;
        while (fromDate <= toDate) {
          vm.prayToSend = new Prays();
          vm.prayToSend.synagogue_id = vm.tokenUser.synagogue_id;
          vm.prayToSend.date = new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate(),
            vm.newPrays.hour.getHours(),
            vm.newPrays.hour.getMinutes(),
            0
          );
          vm.prayToSend.name = vm.newPrays.name;
          vm.prayToSend.special = false;
          $log.info(vm.prayToSend);
          dataToSend = angular.toJson({ pray: vm.prayToSend });
          Prays.save(dataToSend)
            .$promise.then(function () {
              vm.prayToSend = new Prays();
              form.$setPristine();
              vm.loading = false;
              vm.alerta("success", "Success! Pray added");
            })
            .catch(function (response) {
              vm.loading = false;
              vm.alerta("danger", "Sorry, Something went wrog");
              $log.info(response);
            });
          fromDate.setDate(fromDate.getDate() + 1);
        }
      } else {
        vm.loading = true;
        vm.prayToSend = new Prays();
        vm.prayToSend.synagogue_id = vm.tokenUser.synagogue_id;
        vm.prayToSend.date = new Date(
          fromDate.getFullYear(),
          fromDate.getMonth(),
          fromDate.getDate(),
          vm.newPrays.hour.getHours(),
          vm.newPrays.hour.getMinutes(),
          0
        );
        vm.prayToSend.name = vm.newPrays.name;
        vm.prayToSend.description = vm.newPrays.description;
        vm.prayToSend.special = true;
        $log.info(vm.prayToSend);
        dataToSend = angular.toJson({ pray: vm.prayToSend });
        Prays.save(dataToSend)
          .$promise.then(function () {
            vm.prayToSend = new Prays();
            form.$setPristine();
            vm.loading = false;
            vm.alerta("success", "Success! Pray added");
          })
          .catch(function (response) {
            vm.loading = false;
            vm.alerta("danger", "Sorry, Something went wrog");
            $log.info(response);
          });
      }
      vm.special = 0;
      vm.today = new Date();
      vm.yesterday = new Date(
        vm.today.getFullYear(),
        vm.today.getMonth(),
        vm.today.getDate(),
        0,
        0,
        0
      );
      vm.newPrays.from = vm.today;
      vm.newPrays.to = new Date();
      vm.newPrays.to.setDate(vm.today.getDate() + 1);
      vm.newPrays.hour = new Date(
        vm.today.getFullYear(),
        vm.today.getMonth(),
        vm.today.getDate(),
        vm.today.getHours(),
        vm.today.getMinutes(),
        0
      );
      vm.newPrays.name = "";
      vm.newPrays.description = "";
      vm.loading = false;
    };

    vm.updatePray = function (form) {
      Prays.update({ id: vm.editPray.id }, vm.editPray)
        .$promise.then(function (response) {
          form.$setPristine();
          vm.loading = false;
          vm.alerta("success", "Success! Pray edited");
          $log.info(response);
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          vm.loading = false;
          $log.info(response);
        });
    };

    vm.deletePray = function (thisPray) {
      Prays.destroy({ id: thisPray.id })
        .$promise.then(function () {
          vm.alerta("success", "Pray deleted");
          var index = vm.prays.indexOf(thisPray);
          vm.prays.splice(index, 1);
          vm.tableParams = new NgTableParams(
            { page: 1, count: 6 },
            { counts: [], dataset: vm.prays }
          );
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          $log.info(response);
        });
    };

    vm.deletePrayEditing = function (thisPray) {
      Prays.destroy({ id: thisPray.id })
        .$promise.then(function () {
          vm.alerta("success", "Pray deleted");
          $state.go('dashboard.listPray');
        })
        .catch(function (response) {
          vm.alerta("danger", "Sorry, Something went wrog");
          $log.info(response);
        });
    };

    vm.alerta = function (tipo, message) {
      alertService.add(tipo, message, 4000);
    };
    $rootScope.closeAlert = alertService.closeAlert;
  }
})();
