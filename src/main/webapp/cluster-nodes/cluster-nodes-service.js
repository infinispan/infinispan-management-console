'use strict';
angular.module('managementConsole')
    .factory('clusterNodesService', [
    '$q',
    'modelController',
    'utils',
    function ($q, modelController, utils) {
        function restartCluster() {
            var cluster = modelController.getServer().getServerGroup();
            return cluster.restartServers();
        }
        function startCluster() {
            var cluster = modelController.getServer().getServerGroup();
            return cluster.startServers();
        }
        function stopCluster() {
            var cluster = modelController.getServer().getServerGroup();
            return cluster.stopServers();
        }
        function reloadCluster() {
            var cluster = modelController.getServer().getServerGroup();
            return cluster.reloadServers();
        }
        function getChannelName(clusterName) {
            var address = ['profile', clusterName, 'subsystem', 'datagrid-jgroups'];
            return modelController.readChildrenNames(address, 'channel');
        }
        function getView(hostName, serverName, clusterName) {
            return getChannelName(clusterName).then(function (channelName) {
                var address = ['host', hostName, 'server', serverName, 'subsystem', 'datagrid-jgroups',
                    'channel', channelName[0], 'protocol', 'pbcast.GMS'];
                return modelController.readAttribute(address, 'view').then(function (view) {
                    var lastIndex = view.indexOf('|');
                    var hostServerSplitIndex = view.indexOf(':');
                    return {
                        host: view.substring(1, hostServerSplitIndex),
                        server: view.substring(hostServerSplitIndex + 1, lastIndex)
                    };
                }).catch(function () {
                    return {
                        host: '',
                        server: ''
                    };
                });
            });
        }
        function getCoordinatorForServerGroup(hostName, serverName, serverGroup) {
            var address = ['host', hostName, 'server', serverName, 'subsystem', 'datagrid-jgroups',
                'channel', serverGroup, 'protocol', 'pbcast.GMS'];
            return modelController.readAttribute(address, 'view').then(function (view) {
                var lastIndex = view.indexOf('|');
                var hostServerSplitIndex = view.indexOf(':');
                return {
                    host: view.substring(1, hostServerSplitIndex),
                    server: view.substring(hostServerSplitIndex + 1, lastIndex)
                };
            }).catch(function () {
                return {
                    host: '',
                    server: ''
                };
            });
        }
        function getCoordinator(cluster) {
            var servers = cluster.getNodes();
            var firstServer = servers[0]; //lets ask first server
            return getChannelName(cluster.getProfileName()).then(function (channelName) {
                var address = ['host', firstServer.getHost(), 'server', firstServer.getServerName(), 'subsystem', 'datagrid-jgroups',
                    'channel', channelName[0], 'protocol', 'pbcast.GMS'];
                return modelController.readAttribute(address, 'view').then(function (view) {
                    var lastIndex = view.indexOf('|');
                    var hostServerSplitIndex = view.indexOf(':');
                    var host = view.substring(1, hostServerSplitIndex);
                    var server = view.substring(hostServerSplitIndex + 1, lastIndex);
                    var serverIndex = -1; // not found
                    var foundCoordinator = servers.some(function (entry, index) {
                        if (entry.getHost() === host && entry.getServerName() === server) {
                            serverIndex = index;
                            return true;
                        }
                    });
                    if (foundCoordinator) {
                        return servers[serverIndex];
                    }
                    else {
                        return servers[0];
                    }
                }).catch(function () {
                    return servers[0];
                });
            });
        }
        function getViews(cluster) {
            var servers = cluster.getNodes();
            return getViewsForServers(servers, cluster);
        }
        function getViewsForServers(servers, cluster) {
            var promises = servers.map(function (server) {
                if (server.isRunning()) {
                    var address = ['host', server.getHost(), 'server', server.getServerName(), 'subsystem', 'datagrid-infinispan',
                        'cache-container', cluster.getName()];
                    return modelController.readAttribute(address, 'members');
                }
            });
            return $q.all(promises);
        }
        function getCoordinatorsForServers(servers) {
            var promises = servers.map(function (server) {
                return getCoordinatorForServerGroup(server.getHost(), server.getServerName(), server.getGroup());
            });
            return $q.all(promises);
        }
        function areCoordinatorsSameForServers(servers) {
            return getCoordinatorsForServers(servers).then(function (coords) {
                var filteredCoords = coords.filter(function (coord) {
                    return coord.host.length > 0 && coord.server.length > 0;
                });
                var firstCoord = filteredCoords[0];
                return filteredCoords.every(function (coord) {
                    return coord.host === firstCoord.host && coord.server === firstCoord.server;
                });
            });
        }
        function areAllViewsTheSame(cluster) {
            return getViews(cluster).then(function (views) {
                var filteredViews = views.filter(function (view) {
                    return utils.isNotNullOrUndefined(view);
                });
                var firstView = filteredViews[0];
                return cluster.getNodes().length > 0 && filteredViews.every(function (view) {
                    return view === firstView;
                });
            }).catch(function (e) {
                console.log(e);
            });
        }
        function getAvailability(cluster) {
            return areAllViewsTheSame(cluster).then(function (viewsAreTheSame) {
                if (viewsAreTheSame) {
                    return 'AVAILABLE';
                }
                else {
                    return 'DEGRADED';
                }
            });
        }
        return {
            stopCluster: stopCluster,
            startCluster: startCluster,
            restartCluster: restartCluster,
            reloadCluster: reloadCluster,
            getView: getView,
            getCoordinator: getCoordinator,
            areAllViewsTheSame: areAllViewsTheSame,
            getAvailability: getAvailability,
            getCoordinatorForServerGroup: getCoordinatorForServerGroup,
            areCoordinatorsSameForServers: areCoordinatorsSameForServers
        };
    }
]);
//# sourceMappingURL=cluster-nodes-service.js.map