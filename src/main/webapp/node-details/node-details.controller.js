'use strict';

angular.module('managementConsole')
    .controller('NodeDetailsCtrl', ['$scope',
        function ($scope) {
            $scope.helloMsg = 'Node Details';
  }]);

'use strict';

angular.module('managementConsole')
    .controller('NodeDetailsCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $stateParams, $state, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            if (!$stateParams.clusterName && !$stateParams.nodeName) {
                $state.go('error404');
            }
            var server = modelController.getServer();
            var clusters = server.getClusters();
            $scope.currentCluster = server.getCluster(clusters, $stateParams.clusterName);
            $scope.nodes = server.getNodes();
            for (var i = 0; i < $scope.nodes.length; i++) {
                if ($scope.nodes[i].name === $stateParams.nodeName) {
                    $scope.currentNode = $scope.nodes[i];
                    break;
                }
            }
            $scope.currentNodeStats = {
                'cache-status': '',
                'cacheStats': []
            };
            var p = server.fetchNodeStats($scope.currentCluster, $scope.currentNode);
            p.then(function (response) {
                $scope.currentNodeStats.cacheStats = response;
            });
    }]);