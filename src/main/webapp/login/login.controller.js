'use strict';

angular.module('managementConsole')
    .controller('LoginCtrl', [
    '$scope',
    '$state',
    'modelController',
    function ($scope, $state, modelController) {

            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.authenticated = false;
            
            $scope.page.htmlClass = 'login-pf';

            $scope.login = function (credentials) {
                modelController.login(credentials.username, credentials.password).then(function () {
                    $scope.authenticated = true;
                    $scope.page.htmlClass = '';
                    var modelPromise = modelController.refresh();
                    modelPromise.then(function() {
                        $state.go('clustersView');
                    });
                });
            };

            $scope.isAuthenticated = function () {
                return $scope.authenticated;
            };
  }]);
