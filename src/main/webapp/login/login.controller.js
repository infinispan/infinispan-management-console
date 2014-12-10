'use strict';

angular.module('managementConsole')
    .controller('LoginCtrl', [
    '$scope',
    'api',
    '$stateParams',
    '$state',
    function ($scope, api, $stateParams, $state) {
            $scope.credentials = {
                username: '',
                password: ''
            };
            $scope.login = function (credentials) {
                //$state.go('clusterView');
                alert(credentials.username);
            };
  }]);
