'use strict';

angular.module('managementConsole.api')
    .factory('nodeCreateController', [
    '$http',
    '$q',
    'modelController',
    function ($http, $q, modelController) {

            /**
             * Represents a client to the nodeCreateController
             *
             * @constructor
             * @param {string} url - the URL to the ModelController management endpoint
             */
            var NodeCreateController = function (url) {
                this.url = url + '/management';
            };


            /**
             *
             * Executes an operation
             *
             * @param data
             * @param callback
             */
            NodeCreateController.prototype.execute = function (op) {
                var deferred = $q.defer();
                var http = new XMLHttpRequest();
                var username = modelController.credentials.username;
                var password = modelController.credentials.password;
                http.withCredentials = true;
                http.open('POST', this.url, true, username, password);
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Accept', 'application/json');
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        var response = JSON.parse(http.responseText);
                        if (response.outcome === 'success') {
                            deferred.resolve(response.result);
                        } else {
                            deferred.reject();
                        }
                    }
                };
                //console.log(JSON.stringify(op));
                http.send(JSON.stringify(op));
                return deferred.promise;
            };


            /**
             *
             * Creates a node at a given DMR address
             *
             * Operation example:
             * /host=master/server-config=server-five:add(auto-start=true,
             * group=main-server-group,socket-binding-group=clustered-sockets,
             * socket-binding-port-offset=100)
             *
             *
             */
            NodeCreateController.prototype.createServerNode = function (address, autoStart, group,
                                                                               socketBindingGroup,socketBindingPortOffset,
                                                                               callback) {
              var op = {
                'operation': 'add',
                'auto-start': autoStart,
                'group': group,
                'socket-binding-group':socketBindingGroup,
                'socket-binding-port-offset':socketBindingPortOffset,
                'address': address
              };

              var opStart = {
                'operation': 'start',
                'address': address
              };

              //add and start server
              var promise = this.execute(op).then(function(){
                this.execute(opStart);
              }.bind(this));

              promise.then(function(){
                callback();
              });
            };
            return new NodeCreateController(window.location.origin);
    }
  ]);
