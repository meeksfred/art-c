'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', '$rootScope', '$window', '$uibModal', 'authService', NavbarController],
  controllerAs: 'navbarCtrl',
  bindings: {
    appTitle: '@',
    resolve: '<',
    loginToggle: '<',
    artist: '<',
  },
};

function NavbarController($log, $location, $rootScope, $window, $uibModal, authService) {
  $log.debug('init navbarCtrl');

  this.defaultPic = require('../../scss/images/default-profile.jpg');

  this.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };


  function pageLoadHandler() {

    if($location.url() === '/artist'){
      return;
    }

    authService.getToken()
      .then(token => {
        $log.debug(token, 'token');
        $location.url('/home');
      })
      .catch(() => {
        let query = $location.search();
        if (query.token) {
          authService.setToken(query.token)
            .then(() => {
              $location.url('/home');
            });
        }
      });
  }

  $window.onload = pageLoadHandler.bind(this);

  this.artistSignup = function(){
    $log.debug('navbarCtrl.artistSignup()');
    $location.url('/artist');
  };

  this.logout = function() {
    $log.debug('navbarCtrl.logout()');
    authService.logout()
      .then(() => {
        $location.url('/');
      });
  };

  this.open = function(toggleLogin) {
    let modalInstance = $uibModal.open({
      component: 'modal',
      resolve: {
        loginToggle: function(){
          return toggleLogin;
        },
      },
    });

    return modalInstance;
  };


}
