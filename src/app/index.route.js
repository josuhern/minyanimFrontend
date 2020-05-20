(function() {
  'use strict';

  angular
    .module('minyan')
    .config(routerConfig);

  /** @ngInject */
function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/public/ingresar/ingresar.html'
      })
      .state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'app/public/forgotPassword/forgotPassword.html'
      })
    
      .state('dashboard', {
        url: "/dashboard",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/dashboard.html"
      })
      .state('dashboard.main', {
        url: "/main",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/main/main.html"
      })
      .state('dashboard.perfil', {
        url: "/perfil",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/perfil/perfil.html"
      })
      .state('dashboard.usuariosAlta', {
        url: "/usuariosAlta",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/users/alta.html"
      })
      .state('dashboard.usuariosEditar', {
        url: "/usuariosEditar/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/users/editar.html"
      })
      .state('dashboard.usuariosLista', {
        url: "/usuariosLista",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/users/lista.html"
      })
      .state('dashboard.usuariosVista', {
        url: "/usuariosVista/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/users/vista.html"
      })
      .state('dashboard.tipoUsuarioAlta', {
        url: "/tipoUsuarioAlta",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/userTypes/alta.html"
      })
      .state('dashboard.tipoUsuarioEditar', {
        url: "/tipoUsuarioEditar/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/userTypes/editar.html"
      })
      .state('dashboard.tipoUsuarioVista', {
        url: "/tipoUsuarioVista/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/userTypes/vista.html"
      })
      .state('dashboard.tipoUsuarioLista', {
        url: "/tipoUsuarioLista",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/userTypes/lista.html"
      })

      .state('dashboard.sucursalLista', {
        url: "/sucursalLista",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/sites/lista.html"
      })
      .state('dashboard.sucursalAlta', {
        url: "/sucursalAlta",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/sites/alta.html"
      })
      .state('dashboard.sucursalEditar', {
        url: "/sucursalEditar/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/sites/editar.html"
      })
      .state('dashboard.miSucursal', {
        url: "/miSucursal/",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/sites/site.html"
      })
      .state('dashboard.sucursalVista', {
        url: "/sucursalVista/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/sites/vista.html"
      })
      .state('dashboard.addPray', {
        url: "/addPray",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/prays/add.html"
      })
      .state('dashboard.updatePray', {
        url: "/updatePray/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/prays/update.html"
      })
      .state('dashboard.readPray', {
        url: "/readPray/:id",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/prays/read.html"
      })
      .state('dashboard.controlsPray', {
        url: "/controlsPray",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/prays/controls.html"
      })
      .state('dashboard.listPray', {
        url: "/listPray",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/prays/list.html"
      })
      .state('dashboard.minyan', {
        url: "/minyan",
        data : {requireLogin : true },
        templateUrl: "app/private/dashboard/minyan/minyan.html"
      })
    ;
    $urlRouterProvider.otherwise('/');
  }

})();
