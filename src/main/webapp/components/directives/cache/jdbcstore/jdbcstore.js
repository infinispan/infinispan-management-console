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
        link: function (scope, element, attrs) {

          scope.metadata.storeTypes = ['string-keyed-jdbc-store','mixed-keyed-jdbc-store', 'binary-keyed-jdbc-store'];
          if (scope.initDefaults){
            scope.data = {};
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
