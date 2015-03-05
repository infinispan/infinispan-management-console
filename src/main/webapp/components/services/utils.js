(function () {
  'use strict';

  var module = angular.module('ispn.services.utils', []);

  /**
   * @ngdoc service
   * @name ispn.services.utils
   * @description
   * Common utility functions.
   */
  module.factory('utils', function () {
    return {
      /**
       *
       * @param str
       * @returns {boolean}
       */
      isString: function (str) {
        return (typeof str === "string");
      },
      /**
       *
       * @param value
       * @returns {boolean}
       */
      isNotNullOrUndefined: function (value) {
        return !(value === undefined || value === null);
      },
      /**
       *
       * @param value
       * @returns {*|boolean}
       */
      isNonEmptyArray: function (value) {
        return this.isNotNullOrUndefined(value) && this.isArray(value) && value.length > 0;
      },

      /**
       *
       * @param value
       * @returns {boolean}
       */
      isArray: function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
      },

      /**
       *
       * @param obj
       * @returns {boolean}
       */
      isEmptyObject: function isEmptyObject(obj) {
        //see http://api.jquery.com/jQuery.isEmptyObject/
        for (var name in obj) {
          return false;
        }
        return true;
      }
    };
  });
}());
