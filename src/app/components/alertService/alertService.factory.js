(function(){
	'use strict';
	angular
		.module('minyan')
		.factory('alertService',alertServiceFunction);

	function alertServiceFunction($rootScope, $timeout){
		var alertService = {};
        $rootScope.alerts = [];
        alertService.add = function(type, msg, timeout) {
         angular.element('html,body').animate({scrollTop:0},'slow');
         $rootScope.alerts.push({
                type: type,
                msg: msg,
                close: function() {
                    return alertService.closeAlert(this);
                }
            });
            if (timeout) {
                $timeout(function(){ 
                    alertService.closeAlert(this); 
                }, timeout); 
            }
        };
        alertService.closeAlert = function(index) {
          $rootScope.alerts.splice(index, 1);
        };
        return alertService;
	}
})();