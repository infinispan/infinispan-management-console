import {IServerAddress} from "../server/IServerAddress";
import {ICacheContainer} from "../container/ICacheContainer";
import {IMap} from "../../common/utils/IMap";

export interface ITaskExecutor {
  name: string;
  cache: string;
  container: ICacheContainer;
  originator: IServerAddress;
  async: boolean;
  parameters: IMap<string>;
}
