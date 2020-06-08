(function () {
  "use strict";
  angular.module("minyan").controller("SidebarController", SidebarCtrl);

  function SidebarCtrl(
    UserTypes,
    $state,
    $window,
    Auth,
    jwtHelper,
    $localStorage
  ) {
    var vm = this;
    vm.auth = Auth;
    vm.menu = [];
    vm.deleteEnable = false;
    vm.downloadEnable = false;
    vm.openNav = function (){
      angular.element("#mySidebar")[0].style.width = "155px";
      angular.element("#main")[0].style.marginLeft = "155px";
      angular.element("#menu1")[0].style.display = "none";
      angular.element("#menu2")[0].style.display = "block";
    };

    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    vm.closeNav = function () {
      angular.element("#mySidebar")[0].style.width = "0";
      angular.element("#main")[0].style.marginLeft = "0";
      angular.element("#menu1")[0].style.display = "block";
      angular.element("#menu2")[0].style.display = "none";
    };

    vm.newTab = function (url, param) {
      $window.open(url + param, "_blank");
    };

    vm.logout = function () {
      vm.menu = undefined;
      vm.auth.isLoggedIn = false;
      delete $localStorage.currentUser;
      $state.go("home");
      event.preventDefault();
    };

    var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser);
    UserTypes.get({ id: tokenPayload.user_type_id }).$promise.then(function (
      response
    ) {
      vm.allow = response.name;
      switch (response.name) {
        case "Root":
          vm.permisos = {
            write: true,
            read: true,
            edit: true,
            delete: true
          };
          vm.menu = [
            {
              name: "Minyan",
              icon: "fas fa-torah",
              url: "dashboard.minyan"
            },
            {
              name: "Profile",
              icon: "fa fa-user-circle-o",
              url: "dashboard.perfil"
            },
            {
              name: "Synagogues",
              icon: "fas fa-synagogue",
              url: "dashboard.sucursalLista"
            },
            {
              name: "Users",
              icon: "fa fa-users",
              url: "dashboard.usuariosLista"
            },
            {
              name: "User Types",
              icon: "fa fa-cubes",
              url: "dashboard.tipoUsuarioLista"
            },
            {
              name: "Schedule",
              icon: "fas fa-clock",
              url: "dashboard.controlsPray"
            },
            {
              name: "Get it touch",
              icon: "fas fa-comment-dots",
              url: "dashboard.sendSms"
            }
          ];
          break;
        case "Admin":
          vm.permisos = {
            write: true,
            read: true,
            edit: true,
            delete: true
          };
          vm.menu = [
            {
              name: "Minyan",
              icon: "fas fa-torah",
              url: "dashboard.minyan"
            },
            {
              name: "Profile",
              icon: "fa fa-user",
              url: "dashboard.perfil"
            },

            {
              name: "Users",
              icon: "fa fa-users",
              url: "dashboard.usuariosLista"
            },
            {
              name: "Synagogue",
              icon: "fas fa-synagogue",
              url: "dashboard.miSucursal"
            },
            {
              name: "Schedule",
              icon: "fas fa-clock",
              url: "dashboard.controlsPray"
            },
            {
              name: "Get it touch",
              icon: "fas fa-comment-dots",
              url: "dashboard.sendSms"
            }
          ];
          break;
        case "User":
          vm.permisos = {
            write: true,
            read: true,
            edit: false,
            delete: false
          };
          vm.menu = [
            {
              name: "Minyan",
              icon: "fas fa-torah",
              url: "dashboard.minyan"
            },
            {
              name: "Profile",
              icon: "fa fa-user",
              url: "dashboard.perfil"
            },
            {
              name: "Get it touch",
              icon: "fas fa-comment-dots",
              url: "dashboard.sendSms"
            }
          ];
          break;
        default:
          vm.menu = [];
      }
    });
  }
})();
