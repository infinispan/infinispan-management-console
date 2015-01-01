'use strict';

angular.module('managementConsole')
    .controller('CacheDetailsCtrl', [
    '$scope',
    '$q',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $q, $stateParams, $state, modelController) {           
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            if (!$stateParams.clusterName && !$stateParams.cacheName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.caches = $scope.currentCluster.getCachesNameMap();
            $scope.currentCache = $scope.caches[$stateParams.cacheName];
            $scope.currentCacheStats = {
                'cache-status': '',
                'nodeStats': []
            };

            refreshCacheStats();

            function refreshCacheStats() {
                var p = server.fetchCacheStats($scope.currentCluster, $scope.currentCache);
                p.then(function (response) {
                    $scope.currentCacheStats.nodeStats = response;
                });
            }

            // PUT and GET entry to and from REST server endpoint
        
            var contentType = 'application/json';
            $scope.corsproxyAddress = 'http://localhost:9292';
            $scope.ispnRestEndpoint = 'localhost:8080/rest';
            $scope.returnedCacheEntryValue = '';
        
            $scope.putEntry = function() {
                var cacheName = $scope.currentCache.name;
                var key = $scope.cacheEntryKey;
                var value = $scope.cacheEntryValue;
                var http = new XMLHttpRequest();
                http.withCredentials = true;
                // need running corsproxy (npm install -g corsproxy)
                var putUrl = $scope.corsproxyAddress + '/' + $scope.ispnRestEndpoint + '/' + cacheName + '/' + key;
                http.open('PUT', putUrl, true, 'admin', '!qazxsw2');
                http.setRequestHeader('Content-type', contentType);
                http.setRequestHeader('Accept', contentType);
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        $scope.getEntry();
                        refreshCacheStats();
                    }
                };
                http.send(value);
            };

            $scope.getEntry = function() {
                var deferred = $q.defer();
                var cacheName = $scope.currentCache.name;
                var key = $scope.cacheEntryKey;
                var http = new XMLHttpRequest();
                http.withCredentials = true;

                var getUrl = $scope.corsproxyAddress + '/' + $scope.ispnRestEndpoint + '/' + cacheName + '/' + key;

                // TODO: try it with security enabled, BASIC AUTH and with application realm user added
                http.open('GET', getUrl, true, 'admin', '!qazxsw2');
                http.setRequestHeader('Content-type', contentType);
                http.setRequestHeader('Accept', contentType);
                http.onreadystatechange = function () {
                    if (http.readyState === 4 && http.status === 200) {
                        deferred.resolve(http.responseText);
                        refreshCacheStats();
                    } else {
                        if (http.readyState === 4 && http.status === 404) {
                            deferred.resolve('ENTRY NOT FOUND IN CACHE');
                        }
                    }
                };
                http.send(null);

                var getEntryPromise = deferred.promise;
                getEntryPromise.then(function(result) {
                    $scope.returnedCacheEntryValue = result;
                });                
            };
    }]);