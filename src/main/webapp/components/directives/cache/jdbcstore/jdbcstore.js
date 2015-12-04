(function () {
  'use strict';

  var module = angular.module('ispn.directives.cache.jdbcstore', ['ispn.services.utils']);

  module.directive('jdbcstore', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metadata: '=',
          initDefaults: '=',
          readOnly:'='
        },
        replace: true,
        templateUrl: 'components/directives/cache/jdbcstore/jdbcstore.html',
        link: function (scope, element, attrs, ngModelCtrl) {

          scope.hasStringKeyedTable = function () {
            return utils.isNotNullOrUndefined(scope.data) && utils.isNotNullOrUndefined(scope.data['string-keyed-table']);
          };

          scope.hasBinaryKeyedTable = function () {
            return utils.isNotNullOrUndefined(scope.data) && utils.isNotNullOrUndefined(scope.data['binary-keyed-table']);
          };

          if (!utils.isNotNullOrUndefined(scope.data)){
            scope.data = {};
          }
          scope.metadata.storeTypes = ['string-keyed-jdbc-store','mixed-keyed-jdbc-store', 'binary-keyed-jdbc-store'];

          if (scope.hasBinaryKeyedTable() && scope.hasStringKeyedTable()) {
            scope.data.type = 'mixed-keyed-jdbc-store';
          } else if (scope.hasStringKeyedTable()) {
            scope.data.type = 'string-keyed-jdbc-store';
          } else if (scope.hasBinaryKeyedTable()) {
            scope.data.type = 'binary-keyed-jdbc-store';
          } else {
            scope.data.type = "";
          }

          if (scope.initDefaults){
            scope.data.type = scope.metadata.storeTypes[0];

            ['fetch-state', 'passivation', 'preload', 'purge', 'read-only',
              'shared', 'singleton'].forEach(function (attrName) {
                scope.data[attrName] = scope.metadata[attrName].default;
              });
          }

        }
      };
    }
  ]);
}());
