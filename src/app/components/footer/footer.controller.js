(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('FooterController', FooterCtrl);
    
    function FooterCtrl($state){
        var vm = this;
        vm.FooterIsHidden=function() {
            if ($state.includes("dashboard") || $state.includes("dashboardClassroom")){
                return false;
            }else{
                return true;
            }
        };
    }
})();