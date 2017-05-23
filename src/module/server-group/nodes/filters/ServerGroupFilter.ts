import {ServerAddress} from "../../../../services/server/ServerAddress";
import {IMap} from "../../../../common/utils/IMap";

export function serverFilter(): Function {
  return (servers: ServerAddress[], inetMap: IMap<string>, query: string) => {
    let validQuery: boolean = !(query === undefined || query === null) && query.length > 0;
    if (validQuery) {
      let ret: ServerAddress[] = servers.filter(server => {
        let inetAddress: string = inetMap[server.toString()];
        return server.name.indexOf(query) > -1 || inetAddress.indexOf(query) > -1;
      });
      return ret;
    } else {
      return servers;
    }
  };
}
