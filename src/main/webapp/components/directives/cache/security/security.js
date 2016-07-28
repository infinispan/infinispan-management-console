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

        scope.isSecurityEnabled = function () {
          return scope.data['enabled'] === true;
        };

        scope.undoFieldChange = function (field) {
          scope.data[field] = scope.prevData[field];
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
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

        scope.isFieldValueModified = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field].uiModified === true;
        };

        scope.isAnyFieldModified = function () {
          return scope.isFieldValueModified('enabled');
        };


        scope.fieldValueModified = function (field) {
          if (scope.prevData[field] !== scope.data[field]) {
            scope.metadata[field].uiModified = true;
            scope.metadata[field].style = {'background-color': '#fbeabc'};
            scope.$emit('configurationFieldDirty', field);
          } else {
            scope.$emit('configurationFieldClean', field);
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          }
        };

        scope.cleanFieldMetadata = function (field) {
          if (utils.isNotNullOrUndefined(scope.metadata[field])){
            scope.metadata[field].uiModified = false;
            scope.metadata[field].style = null;
          } else {
            console.log("Cleaning metadata for configuration field " + field + ", that field does not exist in DMR model")
          }
        };

        scope.cleanMetadata = function () {
          var fields = ['enabled'];
          fields.forEach(function (field) {
            scope.cleanFieldMetadata(field);
            if (utils.isNotNullOrUndefined(scope.data[field])) {
              scope.prevData[field] = angular.copy(scope.data[field]);
            } else {
              scope.prevData[field] = '';
            }
          });
        };

        scope.undoFieldChange = function (field) {
          scope.data[field] = scope.prevData[field];
          scope.metadata[field].uiModified = false;
          scope.metadata[field].style = null;
        };

        scope.fieldChangeRequiresRestart = function (field) {
          return utils.isNotNullOrUndefined(scope.metadata[field]) && scope.metadata[field]['restart-required'] !== 'no-services';
        };

        scope.requiresRestart = function () {
          return false;
        };

        scope.prevData = {};
        //if not initializing to defaults then make root node in the model tree (if not existing already)
        if (!utils.isNotNullOrUndefined(scope.data)) {
          scope.data = {};
        }
        scope.cleanMetadata();


        scope.internalController.requiresRestart = scope.requiresRestart;
        scope.internalController.cleanMetadata = scope.cleanMetadata;
        scope.internalController.isAnyFieldModified = scope.isAnyFieldModified;
      }
    };
  }
  ]);
}());
