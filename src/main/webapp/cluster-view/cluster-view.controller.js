'use strict';

angular.module('managementConsole')
  .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$q',
    'modelController',
    'cacheCreateController',
    'utils',
    function ($scope, $stateParams, $state, $q, modelController, cacheCreateController, utils) {
      if (!modelController.isAuthenticated()) {
        $state.go('/logout');
      }
      $scope.shared = {
        currentCollection: 'caches'
      };
      $scope.clusters = modelController.getServer().getClusters();
      $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

      $scope.$watch('currentCluster', function (currentCluster) {
        if (currentCluster && currentCluster.name !== $stateParams.clusterName) {
          $state.go('clusterView', {
            'clusterName': currentCluster.name
          });
        }
      });

      $scope.currentClusterAvailability = function () {
        return utils.isNotNullOrUndefined($scope.currentCluster) && $scope.currentCluster.isAvailable();
      };

      $scope.isNodesView = function () {
        return $scope.shared.currentCollection === 'nodes';
      };

      $scope.isCachesView = function () {
        return $scope.shared.currentCollection === 'caches';
      };

      $scope.zoomValue = 0;

      $scope.isZoomedIn = function () {
        return $scope.zoomValue == 0 ? false : true;
      };

      $scope.initialMin = 0;
      $scope.initialMax = 1000;
      $scope.sliders = [
        {
          name: 'Average read time',
          id: 'average-read-time',
          from: $scope.initialMin,
          to: $scope.initialMax
        },
        {
          name: 'Average write time',
          id: 'average-write-time',
          from: $scope.initialMin,
          to: $scope.initialMax
        },
        {
          name: 'Average remove time',
          id: 'average-remove-time',
          from: $scope.initialMin,
          to: $scope.initialMax
        },
        {
          name: 'Average replication time',
          id: 'average-replication-time',
          from: $scope.initialMin,
          to: $scope.initialMax
        }
      ];

      angular.forEach($scope.sliders, function (slider) {
        $scope.$watch(function () {
          return slider;
        }, function (newValue, oldValue) {
          //even though newValue is the right slider that has changed
          //we still have to check all sliders
          if ($scope.isCachesView()) {
            filterOutCaches($scope.sliders);
          } else if ($scope.isNodesView()) {
            filterOutNodes($scope.sliders);
          }
        }, true);
      });

      $scope.clearFilters = function () {
        angular.forEach($scope.sliders, function (slider) {
          slider.from = $scope.initialMin;
          slider.to = $scope.initialMax;
        });
      };

      var filterOutCaches = function (sliderArray) {
        var cachesMap = $scope.currentCluster.getCaches();
        angular.forEach(cachesMap, function (cache) {
          var p = modelController.getServer().fetchCacheStats($scope.currentCluster, cache);
          p.then(function (response) {
            return responseWithinAllSliderRanges(sliderArray, response[0]);
          }).then(function (result) {
            cache.show = result;
          });
        });
      };

      var filterOutNodes = function (sliderArray) {
        var server = modelController.getServer();
        var nodes = server.getNodes();
        var promises = [];
        angular.forEach(nodes, function (node) {
          promises.push(server.fetchAggregateNodeStats($scope.currentCluster, node));
        });
        var p = $q.all(promises);
        p.then(function (responses) {
          angular.forEach(responses, function (resp, index){
            if (resp) {
              nodes[index].show = responseWithinAllSliderRanges(sliderArray, resp);
            }
          });
        });
      };

      var responseWithinAllSliderRanges = function (sliderArray, response) {
        return sliderArray.every(function (slider, index, array){
          var statName = slider.id;
          var statValue = response[statName];
          if (utils.isNotNullOrUndefined(statValue)) {
            return (slider.from <= statValue && statValue <= slider.to);
          } else {
            console.log('Unknown metric ' + statName);
            return true;
          }
        });
      };
    }]);
