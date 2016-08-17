import {App} from "../App";

// TODO when we re-work controller as Typescript objects we should not register to module, but just export class
const module: ng.IModule = App.module("managementConsole", []);

module.controller('LoginCtrl', [
  '$scope',
  '$state',
  'modelController',
  function ($scope, $state, modelController) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.authenticated = false;
    $scope.showLoginSpinner = false;

    $scope.login = function (credentials) {
      $scope.showLoginSpinner = true;
      modelController.login(credentials.username, credentials.password).then(function () {
        $scope.authenticated = true;
        var modelPromise = modelController.refresh();
        modelPromise.then(function () {
          $scope.showLoginSpinner = false;
          $state.go('clustersView');
        });
      }).catch(function (e) {
        console.log(e);
        $scope.loginError = e;
        $scope.showLoginSpinner = false;
      });
    };

    $scope.alertDismissed = function () {
      $scope.loginError = null;
      $state.go('login', null, {reload: true});
    }
  }]);
