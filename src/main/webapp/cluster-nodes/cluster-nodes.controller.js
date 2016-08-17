'use strict';
angular.module('managementConsole')
    .controller('ClusterNodesCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$timeout',
    '$interval',
    '$q',
    'modelController',
    'nodeCreateController',
    'view',
    'utils',
    '$modal',
    function ($scope, $stateParams, $state, $timeout, $interval, $q, modelController, nodeCreateController, view, utils, $modal) {
        var AddNodeModalInstanceCtrl = function ($scope, utils, $modalInstance, $state, modelController, nodeCreateController) {
            $scope.host = $scope.hosts[0];
            $scope.serverName = '';
            $scope.portOffset = 0;
            $scope.createServerNode = function () {
                var modalBoot;
                $modalInstance.close();
                var address = ['host', $scope.host, 'server-config'];
                address.push($scope.serverName);
                nodeCreateController.createServerNode(address, true, $scope.cluster.name, 'clustered-sockets', $scope.portOffset).then(function () {
                    //show booting modal
                    modalBoot = $scope.openBootingModal();
                    //start server
                    return modelController.execute({
                        'operation': 'start',
                        'address': address,
                        'blocking': true
                    });
                }).catch(function () {
                }).finally(function () {
                    modalBoot.close();
                    $scope.refresh();
                });
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        var ClusterModalInstanceCtrl = function ($scope, $modalInstance, $stateParams) {
            $scope.clusterName = $stateParams.clusterName;
            $scope.cancelModal = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        $scope.view = view;
        $scope.hosts = modelController.getServer().getHosts();
        $scope.servers = modelController.getServer().getNodes();
        $scope.cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
        $scope.clusterName = $stateParams.clusterName;
        $scope.refresh = function () {
            $state.go('clusterNodes', {
                clusterName: $scope.clusterName,
                refresh: true
            }, { reload: true });
        };
        $scope.getServersInCluster = function () {
            var serversInCluster = [];
            angular.forEach($scope.servers, function (server) {
                if (server.getGroup() === $stateParams.clusterName) {
                    serversInCluster.push(server);
                }
            });
            return serversInCluster;
        };
        $scope.isCoordinator = function (server) {
            return server.getHost() === $scope.view.host && server.getServerName() === $scope.view.server;
        };
        $scope.startCluster = function () {
            var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
            cluster.startServers().then(function () {
                modelController.refresh();
            }).catch(function (e) {
                $scope.openErrorModal(e);
            });
        };
        $scope.stopCluster = function () {
            var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
            cluster.stopServers().then(function () {
                modelController.refresh();
            }).catch(function (e) {
                $scope.openErrorModal(e);
            });
        };
        $scope.openModal = function () {
            $modal.open({
                templateUrl: 'cluster-nodes/add-node-modal.html',
                controller: AddNodeModalInstanceCtrl,
                scope: $scope
            });
        };
        $scope.openClusterModal = function (mode) {
            $scope.clusterStartStopMode = mode;
            $modal.open({
                templateUrl: 'cluster-nodes/confirmation-node-modal.html',
                controller: ClusterModalInstanceCtrl,
                scope: $scope
            });
        };
        $scope.matchHeight = function () {
            utils.matchHeight(document, '.card-pf');
        };
        $scope.openBootingModal = function () {
            return $modal.open({
                templateUrl: 'components/dialogs/booting.html',
                scope: $scope
            });
        };
    }]).filter('nameFilter', function () {
    return function (serverNodes, query) {
        var validQuery = !(query === undefined || query === null) && query.length > 0;
        //is it a leter?
        if (validQuery) {
            var nodes = [];
            angular.forEach(serverNodes, function (serverNode) {
                var name = serverNode.getName();
                var address = serverNode.getInetAddress();
                if (name.indexOf(query) > -1 || address.indexOf(query) > -1) {
                    nodes.push(serverNode);
                }
            });
            return nodes;
        }
        else {
            return serverNodes;
        }
    };
});
//# sourceMappingURL=cluster-nodes.controller.js.map