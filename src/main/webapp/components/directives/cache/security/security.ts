(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.security', ['ispn.services.utils']);

  module.directive('security', ['utils', function (utils) {
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

        scope.init = function () {
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
          scope.internalController.requiresRestart = scope.requiresRestart;
          scope.internalController.cleanMetadata = scope.cleanMetadata;
          scope.internalController.isAnyFieldModified = scope.isAnyFieldModified;

          if (utils.isNullOrUndefined(scope.data)) {
            scope.data = {};
            utils.deepSet(scope.data, "SECURITY.authorization.AUTHORIZATION", {});
            scope.data.SECURITY[ 'is-new-node'] = true;
            scope.data.SECURITY.authorization.AUTHORIZATION[ 'is-new-node'] = true;
            scope.data = scope.data.SECURITY.authorization.AUTHORIZATION;
          }

          scope.containerRoles = [];
          if (scope.hasSecurityBeenDefinedGlobally()) {
            scope.containerRoles = scope.cluster.security.SECURITY.authorization.AUTHORIZATION.role;
          }
          if (utils.isNullOrUndefined(scope.data.roles)) {
            scope.data.roles = [];
          }

          scope.prevData = {};
          scope.cleanMetadata();
        };

        scope.hasSecurityBeenDefinedGlobally = function () {
          return utils.isNotNullOrUndefined(scope.cluster.security) && utils.isNotNullOrUndefined(scope.cluster.security.SECURITY.authorization.AUTHORIZATION) ;
        };

        scope.getRoleNames = function () {
          var roles = [];
          angular.forEach(scope.containerRoles, function (role) {
            if (utils.isNotNullOrUndefined(role)) {
              roles.push(role.name);
            }
          });
          return roles;
        };

        scope.isSecurityEnabled = function () {
          return scope.data['enabled'] === true;
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
          return scope.isFieldValueModified('enabled');
        };

        scope.fieldValueModified = function (field) {
          var meta = scope.metadata[field];
          if (scope.prevData[field] !== scope.data[field]) {
            utils.makeFieldDirty(meta, field, true, scope);
          } else {
            utils.makeFieldClean(meta, field, true, scope);
          }
        };

        scope.cleanMetadata = function () {
          var fields = ['enabled', 'roles'];
          fields.forEach(function (field) {
            utils.makeFieldClean(scope.metadata[field]);
            if (utils.isNotNullOrUndefined(scope.data[field])) {
              scope.prevData[field] = angular.copy(scope.data[field]);
            } else {
              scope.prevData[field] = '';
            }
          });
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.fieldChangeRequiresRestart(scope.metadata[field]);
        };

        scope.requiresRestart = function () {
          return true;
        };

        scope.init();
      }
    };
  }
  ]);
}());
