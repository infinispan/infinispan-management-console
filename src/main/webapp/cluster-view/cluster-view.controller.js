'use strict';

angular.module('managementConsole')
  .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $stateParams, $state, modelController) {
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

      // define sliders
      var sliderNames = ['average-read-time', 'average-write-time', 'average-remove-time', 'average-replication-time'];

      $scope.clearFilters = function () {
        for (var i = 0; i < sliderNames.length; i++) {
          var slider = $("#" + sliderNames[i]);
          slider.val([0, 60000]);
        }
        var cachesMap = $scope.currentCluster.getCaches();
        for (var k in cachesMap) {
          var cache = cachesMap[k];
          cache.show = true;
        }
      }

      var filterOutCaches = function () {
        var cachesMap = $scope.currentCluster.getCaches();
        for (var k in cachesMap) {
          // do checks
          var filterChangedName = $(this).context.id; //metric i.e. statistic we are checking
          var slid = $("#" + filterChangedName);
          var lowerValue = slid.val()[0];
          var upperValue = slid.val()[1];
          filterCacheVisibility(filterChangedName, cachesMap[k], lowerValue, upperValue);
        }
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
        sliderElement.on('change', filterOutCaches);
      }

      var filterCacheVisibility = function (statisticName, cache, lowerValue, upperValue) {
        var p = modelController.getServer().fetchCacheStats($scope.currentCluster, cache);
        p.then(function (response) {
          var statValue = response[0][statisticName];
          cache.show = (lowerValue <= statValue && statValue <= upperValue);
        });
      };
    }]);