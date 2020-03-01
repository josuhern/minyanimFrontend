(function(){
    'use strict';
    angular
        .module('minyan')
        .controller('NavbarController', NavbarCtrl);
    
    function NavbarCtrl($rootScope, $state, Auth, jwtHelper, $localStorage){
        var vm = this;
        vm.isCollapsed = true;
        vm.auth = Auth;
        vm.isCollapsed = true;
        
        vm.NavbarIsHidden=function(){
            if ($state.includes("dashboard") || $state.includes("dashboardClassroom")){
                return false;
            }else{
                return true;
            }
        };
        
        vm.logout = function(){
            vm.menu=undefined;
            vm.auth.isLoggedIn=false;
            delete $localStorage.currentUser;
            $state.go('home');
            event.preventDefault();
        };
    }
})();