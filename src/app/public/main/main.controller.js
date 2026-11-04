(function(){
	'use strict';
	angular
		.module('minyan')
		.controller('HomeController', HomeCtrl);

	function HomeCtrl(){
        var vm = this;
		vm.isCollapsed = true;
	}
})();