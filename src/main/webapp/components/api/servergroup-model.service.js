'use strict';

angular.module('managementConsole.api')
    .factory('ServerGroupModel', [
    '$q',
    function ($q) {
            /**
             * Represents a ServerGroup
             */
            var ServerGroup = function (name, profile, domain) {
                this.name = name;
                this.profile = profile;
                this.domain = domain;
                this.lastRefresh = null;
            };

            ServerGroup.prototype.getModelController = function () {
                return this.domain.getModelController();
            };

            ServerGroup.prototype.getResourcePath = function () {
                return this.domain.getResourcePath().concat('server-group', this.name);
            };

            ServerGroup.prototype.refresh = function () {
                // Nothing to do here, return a resolved promise
                var deferred = $q.defer();
                deferred.resolve(this);
                return deferred.promise;
            };

            return ServerGroup;
    }
  ]);
