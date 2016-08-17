'use strict';
angular.module('managementConsole')
    .controller('EventsViewCtrl', [
    '$scope',
    'modelController',
    'clusterEventsService',
    function ($scope, modelController, clusterEventsService) {
        $scope.clusters = modelController.getServer().getClusters();
        $scope.gridEvents = [];
        $scope.lineCount = 100;
        $scope.allPossibleLineCounts = [100, 500, 1000, 2000, 5000, 10000];
        $scope.refreshClusterEvents = function (cluster, maxLines) {
            clusterEventsService.fetchClusterEvents(cluster, maxLines).then(function (response) {
                angular.forEach(response, function (event) {
                    $scope.gridEvents.push(event);
                });
            });
        };
        $scope.refreshGridEvents = function () {
            $scope.gridEvents = [];
            angular.forEach($scope.clusters, function (cluster) {
                $scope.refreshClusterEvents(cluster, $scope.lineCount);
            });
        };
        // Refresh grid events
        $scope.refreshGridEvents();
    }]);
//# sourceMappingURL=events-view.controller.js.map