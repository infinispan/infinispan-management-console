'use strict';

angular.module('managementConsole')
  .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$q',
    'modelController',
    function ($scope, $stateParams, $state, $q, modelController) {
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

      $scope.isNodesView = function (){
        return $scope.shared.currentCollection === 'nodes';
      };

      $scope.isCachesView = function (){
        return $scope.shared.currentCollection === 'caches';
      };

      // define sliders
      var sliderNames = ['average-read-time', 'average-write-time', 'average-remove-time', 'average-replication-time'];

      $scope.clearFilters = function () {

        //reset all sliders to initial values
        for (var i = 0; i < sliderNames.length; i++) {
          var slider = $("#" + sliderNames[i]);
          slider.val([0, 60000]);
        }

        //show all caches
        var cachesMap = $scope.currentCluster.getCaches();
        for (var k in cachesMap) {
          var cache = cachesMap[k];
          cache.show = true;
        }

        //show all nodes
        var server = modelController.getServer();
        var nodes = server.getNodes();
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].show = true;
        }
      };

      var filterView = function () {
        var filterChangedName = $(this).context.id;
        if ($scope.isCachesView()) {
          filterOutCaches(filterChangedName);
        } else if ($scope.isNodesView()) {
          filterOutNodes(filterChangedName);
        }
      };

      var filterOutCaches = function (changedFilter) {
        var cachesMap = $scope.currentCluster.getCaches();
        for (var k in cachesMap) {
          // do checks
          var slid = $("#" + changedFilter);
          var lowerValue = slid.val()[0];
          var upperValue = slid.val()[1];
          filterCacheVisibility(changedFilter, cachesMap[k], lowerValue, upperValue);
        }
      };

      var filterOutNodes = function (changedFilter) {
        // do checks
        var slid = $("#" + changedFilter);
        var lowerValue = slid.val()[0];
        var upperValue = slid.val()[1];
        filterNodeVisibility(changedFilter, lowerValue, upperValue);
      };


      for (var i = 0; i < sliderNames.length; i++) {
        var sliderElement = $("#" + sliderNames[i]);
        sliderElement.noUiSlider({
          start: [0, 60000],
          snap: true,
          connect: true,
          range: {
            'min': 0,
            '5%': 1, '10%': 2, '15%': 3, '20%': 4, '25%': 5,
            '30%': 10, '35%': 15, '40%': 20, '45%': 30,
            '50%': 50, '55%': 100, '60%': 200, '65%': 500,
            '70%': 1000, '75%': 2000, '80%': 5000, '85%': 10000,
            '90%': 20000, '95%': 50000,
            'max': 60000
          },
          format: {
            to: function (value) {
              return Math.round(value);
            },
            from: function (value) {
              return value;
            }
          }
        });

        // e.g.: slider-avg-write-time-value-lower
        sliderElement.Link('lower').to($("#" + sliderNames[i] + "-value-lower"));
        sliderElement.Link('upper').to($("#" + sliderNames[i] + "-value-upper"));
        sliderElement.on('change', filterView);
      }

      var filterCacheVisibility = function (statisticName, cache, lowerValue, upperValue) {
        var p = modelController.getServer().fetchCacheStats($scope.currentCluster, cache);
        p.then(function (response) {
          var statValue = response[0][statisticName];
          cache.show = (lowerValue <= statValue && statValue <= upperValue);
        });
      };

      var filterNodeVisibility = function (statisticName, lowerValue, upperValue) {
        var server = modelController.getServer();
        var nodes = server.getNodes();
        var promises = [];
        for (var i = 0; i < nodes.length; i++) {
          promises.push(server.fetchAggregateNodeStats($scope.currentCluster, nodes[i]));
        }
        var p = $q.all(promises);
        p.then(function (responses) {
          var resp = undefined;
          for (var i = 0; i < responses.length; i++) {
            resp = responses[i];
            if (resp) {
              var statValue = resp[statisticName];
              nodes[i].show = (lowerValue <= statValue && statValue <= upperValue);
            }
          }
        });
      };
    }]);