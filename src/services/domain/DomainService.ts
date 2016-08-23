import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDomain} from "./IDomain";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {UtilsService} from "../utils/UtilsService";

const module: ng.IModule = App.module("managementConsole.services.domain", []);

export class DomainService {

  static $inject: string[] = ["$q", "dmrService", "utils"];

  constructor(private $q: IQService, private dmrService: DmrService, private utils: UtilsService) {
  }

  getHostsAndServers(): ng.IPromise<IDomain> {
    let deferred: ng.IDeferred<IDomain> = this.$q.defer<IDomain>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "host"
    };

    this.dmrService.readChildResources(request)
      .then((response) => {
        let domain: IDomain = <IDomain>{servers: {}};

        for (let hostname in response) {
          var host: any = response[hostname];
          if (host.master) {
            domain.controller = hostname;
          }
          domain.servers[hostname] = Object.keys(host.server);
        }
        deferred.resolve(domain);
      });

    return deferred.promise;
  }

  getServerView(server: string, container: string): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", "*", "server", server, "subsystem", "datagrid-infinispan", "cache-container", container),
      name: "members"
    };
    this.dmrService.readAttribute(request).then((response) => deferred.resolve(response.result));
    return deferred.promise;
  }

}

module.service("domainService", DomainService);
