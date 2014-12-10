'use strict';

angular.module('managementConsole.api')
    .factory('ModelController', [
    'DomainModel',
    'StandaloneModel',
    function (DomainModel, StandaloneModel) {
            // operations: read-resource-description, read-resource, read-attribute

            /**
             * Represents a client to the ModelController
             * @constructor
             * @param {string} url - the URL to the ModelController management endpoint
             */
            var ModelControllerClient = function (url) {
                this.url = url + '/management';
            };

            /**
             * Logs into the management endpoint and determines the launch type
             * @param {string} username - the username to use when connecting to the management endpoint
             * @param {string} password - the password to use when connecting to the management endpoint
             */
            ModelControllerClient.prototype.login = function (username, password, callback) {
                this.username = username;
                this.password = password;
                this.readResource([], false, true, function (response) {
                    var launchType = response['launch-type'];
                    if (launchType === 'DOMAIN') {
                        callback(new DomainModel(this, response));
                    } else if (launchType === 'STANDALONE') {
                        callback(new StandaloneModel(this, response));
                    }
                }.bind(this));
            };

      /**
       * Executes an operation
       * @param data
       * @param callback
       */
      ModelControllerClient.prototype.execute = function(op, callback) {
        var http = new XMLHttpRequest();
        http.withCredentials = true;
        http.open('POST', this.url, true, this.username, this.password);
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('Accept', 'application/json');
        http.onreadystatechange = function() {
          if (http.readyState === 4 && http.status === 200) {
            var response = JSON.parse(http.responseText);
            if (response.outcome === 'success') {
              if (callback) {
                callback(response.result);
              }
            } else {
              console.error(response);
            }
          }
        };
        http.send(JSON.stringify(op));
      };
            /**
             * Executes an operation
             * @param data
             * @param callback
             */
            ModelControllerClient.prototype.execute = function (op, callback) {
                var http = new XMLHttpRequest();
                http.withCredentials = true;
                http.open('POST', this.url, true, this.username, this.password);
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Accept', 'application/json');
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        var response = JSON.parse(http.responseText);
                        if (response.outcome === 'success') {
                            if (callback) {
                                callback(response.result);
                            }
                        } else {
                            console.error(response);
                        }
                    }
                };
                http.send(JSON.stringify(op));
            };

            ModelControllerClient.prototype.readChildrenNames = function (address, type, callback) {
                // parameters: RECURSIVE, RECURSIVE_DEPTH, PROXIES, INCLUDE_RUNTIME, INCLUDE_DEFAULTS, ATTRIBUTES_ONLY, INCLUDE_ALIASES
                var op = {
                    'operation': 'read-children-names',
                    'child-type': type,
                    'address': address
                };
                this.execute(op, callback);
            };

            ModelControllerClient.prototype.readChildrenResources = function (address, type, recursive, proxies, includeRuntime, callback) {
                // parameters: RECURSIVE, RECURSIVE_DEPTH, PROXIES, INCLUDE_RUNTIME, INCLUDE_DEFAULTS, ATTRIBUTES_ONLY, INCLUDE_ALIASES
                var op = {
                    'operation': 'read-children-resources',
                    'child-type': type,
                    'recursive': recursive,
                    'proxies': proxies,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                this.execute(op, callback);
            };


            ModelControllerClient.prototype.readResource = function (address, recursive, includeRuntime, callback) {
                // parameters: RECURSIVE, RECURSIVE_DEPTH, PROXIES, INCLUDE_RUNTIME, INCLUDE_DEFAULTS, ATTRIBUTES_ONLY, INCLUDE_ALIASES
                var op = {
                    'operation': 'read-resource',
                    'recursive': recursive,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                this.execute(op, callback);
            };

            ModelControllerClient.prototype.readResourceDescription = function (address, recursive, includeRuntime, callback) {
                // parameters: OPERATIONS, INHERITED, RECURSIVE, RECURSIVE_DEPTH, PROXIES, INCLUDE_ALIASES, ACCESS_CONTROL, LOCALE
                var op = {
                    'operation': 'read-resource-description',
                    'recursive': recursive,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                this.execute(op, callback);
            };

            return ModelControllerClient;
    }
  ]);