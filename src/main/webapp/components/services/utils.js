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
      },

      deepSet: function setValue(object, path, value) {
        var a = path.split('.');
        var o = object;
        for (var i = 0; i < a.length - 1; i++) {
          var n = a[i];
          if (n in o) {
            o = o[n];
          } else {
            o[n] = {};
            o = o[n];
          }
        }
        o[a[a.length - 1]] = value;
      },

      deepGet: function getValue(object, path) {
        var o = object;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var a = path.split('.');
        while (a.length) {
          var n = a.shift();
          if (n in o) {
            o = o[n];
          } else {
            return;
          }
        }
        return o;
      },

      makeResourceDescriptionMap: function makeResourceDescriptionMap(map) {
        map['general'] = '.attributes';
        map['locking'] = 'children.locking.model-description.LOCKING.attributes';
        map['eviction'] = 'children.eviction.model-description.EVICTION.attributes';
        map['expiration'] = 'children.expiration.model-description.EXPIRATION.attributes';
        map['compatibility'] = 'children.compatibility.model-description.*.attributes';
        map['tx'] = 'children.transaction.model-description.TRANSACTION.attributes';
        map['statetransfer'] = 'children.state-transfer.model-description.STATE_TRANSFER.attributes';
        map['filestore'] = 'children.file-store.model-description.*.attributes';
        map['remotestore'] = 'children.remote-store.model-description.*.attributes';
        map['jdbcstore'] = 'children.string-keyed-jdbc-store.model-description.*.attributes';
        map['leveldbstore'] = 'children.leveldb-store.model-description.*.attributes';
        map['backup'] = 'children.backup.model-description.*.attributes';
        map['loader'] = 'children.loader.model-description.*.attributes';
        map['authorization'] = 'children.security.model-description.*.children.authorization.model-description.*.attributes';
      },

      resolveDescription: function resolveDescription(metadata, resourceDescriptionMap, elementPath, cacheType) {
        var path = 'children.' + cacheType + '.model-description.*';
        var realPath = resourceDescriptionMap[elementPath];
        var resourceDescription = this.deepGet(metadata, path);
        return this.deepGet(resourceDescription, realPath);
      },

      convertCacheAttributeIntoFieldName: function convertCacheAttributeIntoFieldName(attribute) {
        var str = attribute.replace(/-/g, ' ');
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },

      resolveFieldType: function resolveFieldType(metadata, field) {
        var fieldType;
        switch (metadata[field].type.TYPE_MODEL_VALUE) {
          case 'LONG':
          case 'INT':
          case 'STRING':
            fieldType = 'text';
            break;
          case 'BOOLEAN':
            fieldType = 'checkbox';
            break;
        }
        return fieldType;
      }
    };
  });
}());
