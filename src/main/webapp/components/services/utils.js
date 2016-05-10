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
        return (typeof str === 'string');
      },

      /**
       *
       * @param str
       * @returns {boolean}
       */
      isNonEmptyString: function (str) {
        return this.isString(str) && str.length > 0;
      },

      /**
       *
       * @param str
       * @returns {boolean}
       */
      isBoolean: function (b) {
        return (typeof b === 'boolean');
      },

      /**
       *
       * @param str
       * @returns {boolean}
       */
      isNumber: function (n) {
        return (typeof n === 'number');
      },

      /**
       *
       * @param str
       * @returns {boolean}
       */
      isObject: function (o) {
        return this.isNotNullOrUndefined(o) &&
               !this.isBoolean(o) &&
               !this.isString(o) &&
               !this.isNumber(o);
      },
      /**
       *
       * @param value
       * @returns {boolean}
       */
      isNotNullOrUndefined: function (value) {
        return !(this.isNullOrUndefined(value));
      },

      /**
       *
       * @param value
       * @returns {boolean}
       */
      isNullOrUndefined: function (value) {
        return value === undefined || value === null;
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

      deepValue: function deepValue(obj, path){
        for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
          if (this.isNotNullOrUndefined(obj)) {
            obj = obj[path[i]];
          } else {
            return null;
          }
        };
        return obj;
      },

      makeResourceDescriptionMap: function makeResourceDescriptionMap(map) {
        map.general = '.attributes';
        map.locking = 'children.locking.model-description.LOCKING.attributes';
        map.eviction = 'children.eviction.model-description.EVICTION.attributes';
        map.expiration = 'children.expiration.model-description.EXPIRATION.attributes';
        map.indexing = 'children.indexing.model-description.INDEXING.attributes';
        map.compatibility = 'children.compatibility.model-description.*.attributes';
        map['partition-handling'] = 'children.partition-handling.model-description.PARTITION_HANDLING.attributes';
        map.tx = 'children.transaction.model-description.TRANSACTION.attributes';
        map.statetransfer = 'children.state-transfer.model-description.STATE_TRANSFER.attributes';
        map.filestore = 'children.file-store.model-description.*.attributes';
        map.remotestore = 'children.remote-store.model-description.*.attributes';
        map.jdbcstore = 'children.mixed-keyed-jdbc-store.model-description.*.attributes';
        map.leveldbstore = 'children.leveldb-store.model-description.*.attributes';
        map.store = 'children.store.model-description.*.attributes';
        map['rest-store'] = 'children.rest-store.model-description.*.attributes';
        map.backup = 'children.backup.model-description.*.attributes';
        map.loader = 'children.loader.model-description.*.attributes';
        map.authorization = 'children.security.model-description.*.children.authorization.model-description.*.attributes';
      },

      resolveDescription: function resolveDescription(metadata, resourceDescriptionMap, elementPath, cacheType) {
        var path = 'children.configurations.model-description.CONFIGURATIONS.children.' + cacheType + '-configuration.model-description.*';
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
        if (this.isNotNullOrUndefined(metadata) && this.isNotNullOrUndefined(field)) {
          var resolvedField = metadata[field];
          if (this.isNotNullOrUndefined(resolvedField)) {
            var fieldType;
            switch (resolvedField.type.TYPE_MODEL_VALUE) {
              case 'DOUBLE':
              case 'LONG':
              case 'INT':
              case 'STRING':
              case 'LIST':
                fieldType = 'text';
                break;
              case 'BOOLEAN':
                fieldType = 'checkbox';
                break;
              case 'OBJECT':
                fieldType = 'table';
                break;
            }
            return fieldType;
          } else {
            throw new this.ISPNException('Unresolved field for ' + metadata + ' and field ' + field);
          }
        } else {
            throw new this.ISPNException('Invalid metadata ' + metadata + ' or field ' + field);
        }
      },

      getCacheMode: function getCacheMode (cacheModel) {
        return cacheModel.configuration.mode === 'SYNC'? 'Sync':'Async';
      },

      ISPNException: function ISPNException(message) {
        this.message = message;
        this.name = 'ISPNException';
      },

      getCacheType: function getCacheType(cacheModel) {
        var cacheType = 'Distributed';
        if (cacheModel.isReplicated()) {
          cacheType = 'Replicated';
        }
        else if (cacheModel.isInvalidation()) {
          cacheType = 'Invalidation';
        }
        else if (cacheModel.isLocal()) {
          cacheType = 'Local';
        }
        return cacheType;
      },

      /***
       * Finds duplicates in an input array and counts number of those duplicates
       *
       * credits to https://gist.github.com/ralphcrisostomo/3141412
       */
      countOccurrences: function countOccurrences(anArray) {

        var compressed = [];
        // make a copy of the input array
        var copy = anArray.slice(0);

        // first loop goes over every element
        for (var i = 0; i < anArray.length; i++) {

          var myCount = 0;
          // loop over every element in the copy and see if it's the same
          for (var w = 0; w < copy.length; w++) {
            if (anArray[i] === copy[w]) {
              // increase amount of times duplicate is found
              myCount++;
              // sets item to undefined
              delete copy[w];
            }
          }

          if (myCount > 0) {
            var a = {};
            a.value = anArray[i];
            a.count = myCount;
            compressed.push(a);
          }
        }
        return compressed;
      },

      getRandomInt: function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      has: function has(object, key) {
        return object ? hasOwnProperty.call(object, key) : false;
      },

      matchHeight: function matchHeight(elem, selector) {
        var elements = $(elem).find(selector);
        elements.matchHeight({
          byRow: false,
          property: 'height',
          target: null,
          remove: false
        });
      },

      toCamelCase: function toCamelCase(inputText) {
        var text = inputText.toLowerCase();
        var split = text.split(' ');

        //iterate through each of the "words" and capitalize them
        for (var i = 0, len = split.length; i < len; i++) {
          split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
        }

        return split.join(' ');
      },

      traverse: function traverse(obj, callback, trail) {
        trail = trail || [];

        Object.keys(obj).forEach(function (key) {
          var value = obj[key];

          if (Object.getPrototypeOf(value) === Object.prototype) {
            traverse(value, callback, trail.concat(key));
          } else {
            callback.call(obj, key, value, trail);
          }
        });
      },

      clusterAvailability: function clusterAvailability(cluster){
        if(this.isNotNullOrUndefined(cluster)){
          return this.toCamelCase(cluster.getAvailable());
        } else {
          return 'Unavailable';
        }
      }
    };
  });
}());
