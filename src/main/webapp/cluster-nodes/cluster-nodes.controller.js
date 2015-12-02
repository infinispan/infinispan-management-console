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
    'utils',
    '$modal',
    function ($scope, $stateParams, $state, $timeout, $interval, $q, modelController, nodeCreateController, utils, $modal) {
      $scope.getServersInCluster = function () {
        var serversInCluster = [];
        angular.forEach($scope.servers, function (server, key) {
          if (server.getGroup() === $stateParams.clusterName) {
            serversInCluster.push(server);
          }
        });

        //now add stopped servers
        angular.forEach($scope.servers, function (server, key) {
          if (server.isStopped()) {
            serversInCluster.push(server);
          }
        });
        return serversInCluster;
      };

      $scope.refresh = function (refreshDomain) {
        refreshDomain = (typeof refreshDomain === 'undefined') ? true : false;
        if (refreshDomain) {
          modelController.getServer().refresh();
        }
        $scope.hosts = modelController.getServer().getHosts();
        $scope.servers = modelController.getServer().getNodes();
        $scope.cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
      };

      $scope.refresh(false);

      $scope.startCluster = function () {
        var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
        cluster.startServers();
      };

      $scope.stopCluster = function () {
        var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
        cluster.stopServers();
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
        $modal.open({
          templateUrl: 'cluster-nodes/booting.html',
          controller: BootingInstanceCtrl
        });
      };

      $scope.openWIPModal = function () {
        $modal.open({
          templateUrl: 'workinprogress.html',
          controller: ModalInstanceCtrl
        });
      };
    }]).filter('inetAddressFilter', function (){
    return function (serverNodes, query) {
      var validQuery = !(query === undefined || query === null) && query.length > 0;
      //is it a number?
      if (validQuery && !isNaN(query)) {
        var nodes = [];
        angular.forEach(serverNodes, function (serverNode) {
          var address = serverNode.getInetAddress();
          if (address.indexOf(query) > -1) {
            nodes.push(serverNode);
          }
        });
        return nodes;
      } else {
        return serverNodes;
      }
    };
  }).filter('nameFilter', function (){
    return function (serverNodes, query) {
      var validQuery = !(query === undefined || query === null) && query.length > 0;
      //is it a leter?
      if (validQuery && isNaN(query)) {
        var nodes = [];
        angular.forEach(serverNodes, function (serverNode) {
          var name = serverNode.getName();
          if (name.indexOf(query) > -1) {
            nodes.push(serverNode);
          }
        });
        return nodes;
      } else {
        return serverNodes;
      }
    };
  });

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var BootingInstanceCtrl = function ($scope, $modalInstance, modelController, $state, $timeout, $interval) {

  $scope.countDown = 30;
  $timeout(function(){$scope.refreshServers();}, $scope.countDown * 1000);

  $scope.refreshServers = function () {
    $modalInstance.close();
    modelController.getServer().refreshServers().then(function () {
      $state.go($state.current, {}, {reload: true});
    })
  };

  $interval(function() {$scope.countDown--;}, 1000, false);
};

var AddNodeModalInstanceCtrl = function ($scope, utils, $modalInstance, $state, modelController, nodeCreateController) {

  $scope.host = $scope.hosts[0];
  $scope.serverName;
  $scope.portOffset = utils.getRandomInt(0, 1000);


  $scope.createServerNode = function () {
    var address = ['host', $scope.host, 'server-config'];
    address.push($scope.serverName);
    nodeCreateController.createServerNode(address, true, $scope.cluster.name, 'clustered-sockets', $scope.portOffset, function () {
      $modalInstance.close();
      $scope.openBootingModal();
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
