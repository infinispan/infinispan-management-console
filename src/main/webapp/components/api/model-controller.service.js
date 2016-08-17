define(["require", "exports", "../../App"], function (require, exports, App_1) {
    "use strict";
    var module = App_1.App.module('managementConsole.api.model-controller', ["LocalStorageModule"]);
    module.factory('modelController', [
        '$http',
        '$q',
        'DomainModel',
        'utils',
        'localStorageService',
        '$interval',
        '$rootScope',
        function ($http, $q, DomainModel, utils, localStorageService, $interval, $rootScope) {
            var randomUsername = 'kmyZf1qpQWPJe95lCCg0';
            var randomPassword = '2RAwgCZ0zBCU0ZyuSGQB';
            var connectionChecker;
            /**
             * Represents a client to the ModelController
             * @constructor
             * @param {string} url - the URL to the ModelController management endpoint
             */
            var ModelControllerClient = function (url) {
                this.uploadUrl = url + '/management-upload';
                this.url = url + '/management';
                this.authenticated = false;
                this.credentials = {
                    // in case we do not have stored credentials use random generated strings
                    // that are guaranteed to fail authentication
                    username: localStorageService.get('username') || randomUsername,
                    password: localStorageService.get('password') || randomPassword
                };
                this.server = null;
            };
            ModelControllerClient.prototype.isAuthenticated = function () {
                return this.authenticated;
            };
            ModelControllerClient.prototype.getServer = function () {
                return this.server;
            };
            ModelControllerClient.prototype.serverInfo = function () {
                return this.execute();
            };
            /**
             * Logs into the management endpoint and determines the launch type.
             * If username and/or password are not given, previously stored username and/or password are used.
             * @param {string} username - the username to use when connecting to the management endpoint
             * @param {string} password - the password to use when connecting to the management endpoint
             */
            ModelControllerClient.prototype.login = function (username, password) {
                if (utils.isNotNullOrUndefined(username) && utils.isNonEmptyString(username)) {
                    this.credentials.username = username;
                }
                else {
                    this.credentials.username = randomUsername;
                }
                if (utils.isNotNullOrUndefined(password) && utils.isNonEmptyString(password)) {
                    this.credentials.password = password;
                }
                else {
                    this.credentials.password = randomPassword;
                }
                return this.readResource([], false, true).then(function (response) {
                    // TODO: Handle situation where response is received but login failed - that happens!
                    this.authenticated = true;
                    localStorageService.set('username', this.credentials.username);
                    localStorageService.set('password', this.credentials.password);
                    var launchType = response['launch-type'];
                    if (launchType === 'DOMAIN') {
                        this.server = new DomainModel(this, response);
                    }
                    else if (launchType === 'STANDALONE') {
                        throw "We only support Domain mode. Standalone mode is not supported in this release!";
                    }
                    connectionChecker = $interval(function () {
                        this.isDomainControllerAlive().then(function (result) {
                            $rootScope.isDomainControllerAlive = result;
                        });
                    }.bind(this), 5000);
                }.bind(this)).catch(function (e) {
                    this.logout();
                    throw e;
                }.bind(this));
            };
            ModelControllerClient.prototype.refresh = function () {
                return this.server.refresh();
            };
            ModelControllerClient.prototype.logout = function () {
                this.credentials = {
                    username: null,
                    password: null
                };
                localStorageService.remove('username');
                localStorageService.remove('password');
                this.authenticated = false;
                this.server = null;
                if (utils.isNotNullOrUndefined(connectionChecker)) {
                    $interval.cancel(connectionChecker);
                }
            };
            ModelControllerClient.prototype.getUser = function () {
                if (this.authenticated) {
                    return this.credentials.username;
                }
                else {
                    return null;
                }
            };
            ModelControllerClient.prototype.getCredentials = function () {
                return this.credentials;
            };
            /**
             * Executes an operation
             * @param data
             * @param callback
             */
            ModelControllerClient.prototype.execute = function (op, url) {
                var url = (typeof url === 'undefined') ? this.url : url;
                var deferred = $q.defer();
                var http = new XMLHttpRequest();
                http.open('POST', url, true, this.credentials.username, this.credentials.password);
                http.withCredentials = true;
                http.setRequestHeader('Content-type', 'application/json');
                http.setRequestHeader('Accept', 'application/json');
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        var response = JSON.parse(http.responseText);
                        if (response.outcome === 'success') {
                            deferred.resolve(response.result);
                        }
                        else {
                            deferred.reject();
                        }
                    }
                    else if (http.readyState === 4 && http.status >= 400 && http.status <= 505) {
                        if (http.status === 401) {
                            deferred.reject("Invalid login or password. Please try again");
                        }
                        else {
                            var response = http.responseText;
                            if (response) {
                                try {
                                    response = JSON.parse(response);
                                    if (utils.isNotNullOrUndefined(response['failure-description'])) {
                                        deferred.reject(response['failure-description']);
                                    }
                                    else {
                                        deferred.reject('An unspecified error has been received from the server:' + e);
                                    }
                                }
                                catch (e) {
                                    console.log('JSON.parse()', e);
                                    deferred.reject('An unspecified error has been received from the server:' + e);
                                }
                            }
                            else {
                                deferred.reject('An unspecified error has been received from the server:' + e);
                            }
                        }
                    }
                };
                http.timeout = 2000; // time in milliseconds
                http.ontimeout = function (e) {
                    deferred.reject("Request timeout " + e);
                };
                http.send(JSON.stringify(op));
                return deferred.promise;
            };
            ModelControllerClient.prototype.executeDeploymentOp = function (op, file, uploadProgress) {
                var deferred = $q.defer();
                var fd = new FormData();
                //First we append the file if we have it
                if (utils.isNotNullOrUndefined(file)) {
                    fd.append('file', file);
                }
                //Second, we append the DMR operation
                var blob = new Blob([JSON.stringify(op)], { type: 'application/json' });
                fd.append('operation', blob);
                var http = new XMLHttpRequest();
                http.upload.addEventListener('progress', uploadProgress, false);
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        var response = http.responseText;
                        if (response) {
                            try {
                                response = JSON.parse(response);
                            }
                            catch (e) {
                                console.log('JSON.parse()', e);
                                deferred.reject(e);
                            }
                        }
                        if (response.outcome === 'success') {
                            deferred.resolve(response.result);
                        }
                        else {
                            deferred.reject(response.result);
                        }
                    }
                    else if (http.status >= 400 && http.status <= 505) {
                        deferred.reject(http.statusText);
                    }
                };
                http.timeout = 2000; // time in milliseconds
                http.ontimeout = function (e) {
                    deferred.reject("Request timeout " + e);
                };
                http.addEventListener('error', function (e) {
                    console.log('Error: Upload failed', e);
                    //callback(true);
                });
                //Third, we open http connection
                if (this.credentials.username) {
                    http.open('POST', this.uploadUrl, true, this.credentials.username, this.credentials.password);
                    http.withCredentials = true;
                }
                else {
                    http.open('POST', this.uploadUrl, true);
                }
                //special headers to prevent CSRF
                http.setRequestHeader('X-Management-Client-Name', 'HAL');
                //Finally, send the form data to the server
                http.send(fd);
                return deferred.promise;
            };
            ModelControllerClient.prototype.readAttribute = function (address, name) {
                var op = {
                    'operation': 'read-attribute',
                    'name': name,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.writeAttribute = function (address, name, value) {
                var op = {
                    'operation': 'write-attribute',
                    'name': name,
                    'value': value,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.readAttributeAndResolveExpressions = function (address, name, resolveExpressions) {
                var op = {
                    'operation': 'read-attribute',
                    'name': name,
                    'address': address,
                    'resolve-expressions': resolveExpressions
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.readChildrenNames = function (address, type) {
                var op = {
                    'operation': 'read-children-names',
                    'child-type': type,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.readChildrenResources = function (address, type, recursiveDepth, proxies, includeRuntime) {
                var op = {
                    'operation': 'read-children-resources',
                    'child-type': type,
                    'recursive': recursiveDepth > 1,
                    'recursive-depth': recursiveDepth,
                    'proxies': proxies,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.readResource = function (address, recursive, includeRuntime) {
                var op = {
                    'operation': 'read-resource',
                    'recursive': recursive,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.readResourceDescription = function (address, recursive, includeRuntime) {
                var op = {
                    'operation': 'read-resource-description',
                    'recursive': recursive,
                    'include-runtime': includeRuntime,
                    'address': address
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.createAddArtifactOp = function (deploymentArtifact) {
                var op = {
                    operation: 'add',
                    address: [{
                            deployment: deploymentArtifact
                        }],
                    'runtime-name': deploymentArtifact,
                    enabled: 'false',
                    content: [{ 'input-stream-index': 0 }]
                };
                return op;
            };
            ModelControllerClient.prototype.deployArtifact = function (serverGroup, deployment) {
                var op = {
                    operation: 'deploy',
                    address: [{
                            deployment: deployment
                        }]
                };
                return this.executeDeploymentOp(op);
            };
            ModelControllerClient.prototype.undeployArtifact = function (serverGroup, deployment) {
                var op = {
                    operation: 'undeploy',
                    address: [{
                            deployment: deployment
                        }]
                };
                return this.executeDeploymentOp(op, this.uploadUrl);
            };
            ModelControllerClient.prototype.removeArtifact = function (serverGroup, deployment) {
                var op = {
                    operation: 'remove',
                    address: [{
                            deployment: deployment
                        }]
                };
                return this.execute(op);
            };
            ModelControllerClient.prototype.isDomainControllerAlive = function () {
                return this.readResource([], false, false).then(function () {
                    return true;
                }).catch(function () {
                    return false;
                });
            };
            ModelControllerClient.prototype.getDeployedArtifacts = function () {
                return this.readChildrenResources([], 'deployment');
            };
            // IE won't support window.location.origin
            var windowOrigin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            return new ModelControllerClient(windowOrigin);
        }
    ]);
});
//# sourceMappingURL=model-controller.service.js.map