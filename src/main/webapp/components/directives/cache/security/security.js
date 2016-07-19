(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.security', ['ispn.services.utils']);

  module.directive('security', ['utils', '$modal', function (utils, modal) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        cluster: '=',
        metadata: '=',
        initDefaults: '=',
        readOnly: '=',
        outsideController: '='
      },
      replace: true,
      templateUrl: 'components/directives/cache/security/security.html',
      link: function (scope) {
        if (utils.isNotNullOrUndefined(scope.outsideController)) {
          if (utils.isArray(scope.outsideController)) {
            var handle = {};
            scope.outsideController.push(handle);
            scope.internalController = handle;
          } else {
            scope.internalController = scope.outsideController;
          }
        } else {
          scope.internalController = {};
        }
        scope.hasSecurityBeenDefinedGlobally = function () {
          return utils.isNotNullOrUndefined(scope.cluster.security) && utils.isNotNullOrUndefined(scope.cluster.security.SECURITY.authorization.AUTHORIZATION) ;
        };

        if (utils.isNullOrUndefined(scope.data)) {
          scope.data = {};
          utils.deepSet(scope.data, "SECURITY.authorization.AUTHORIZATION", {});
          scope.data = scope.data.SECURITY.authorization.AUTHORIZATION;
        }

        scope.containerRoles = [];
        if (scope.hasSecurityBeenDefinedGlobally()) {
          scope.containerRoles = scope.cluster.security.SECURITY.authorization.AUTHORIZATION.role;
        }
        if (utils.isNullOrUndefined(scope.data.roles)) {
          scope.data.roles = [];
        }
        scope.getRoleNames = function () {
          var roles = [];
          angular.forEach(scope.containerRoles, function (role) {
            if (utils.isNotNullOrUndefined(role)) {
              roles.push(role.name);
            }
          });
          return roles;
        };

        // toggle selection for a given role by name
        scope.toggleSelection = function toggleSelection(role) {
          var idx = scope.data.roles.indexOf(role);

          // is currently selected
          if (idx > -1) {
            scope.data.roles.splice(idx, 1);
          }

          // is newly selected
          else {
            scope.data.roles.push(role);
          }
        };

        scope.isRoleSelected = function (role) {
          return scope.data.roles.indexOf(role) > -1;
        };

        scope.isAnyFieldModified = function () {
          return true;
        };

        scope.cleanMetadata = function () {
          //todo
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] !== 'no-services';
        };

        scope.requiresRestart = function () {
          return false;
        };

        scope.internalController.requiresRestart = scope.requiresRestart;
        scope.internalController.cleanMetadata = scope.cleanMetadata;
        scope.internalController.isAnyFieldModified = scope.isAnyFieldModified;
      }
    };
  }
  ]);
}());
