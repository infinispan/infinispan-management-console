import {App} from "../../ManagementConsole";

const module: ng.IModule = App.module("managementConsole.services.interceptors", [
  "managementConsole.services.authentication"
]);

export class ServerStatusInterceptor {

  static $inject: string[] = ["$injector", "$q"];

  public static self: any = ServerStatusInterceptor;

  public static serverStatusTimeout:number = 5000;
  public static serverStatusTimer: any;
  public static statusCallsFired: number = 0;
  public static maxStatusCalls: number = 20;

  public static ngInjector:any;
  public static ngQ:any;

  public static resetLastRequestTimer(timer: number, self: any): any {
    if (timer) {
      clearTimeout(timer);
    }

    return setTimeout(function(): void {
      self.ngInjector.get("availabilityCheck").checkServerIsAlive();
      ++self.statusCallsFired;
    }, this.serverStatusTimeout);
  }

  public static isServerStausResponse(config: any, self: any): boolean {
    if (!config.data) {
      return undefined;
    }
    const data: any = config.data;
    const request: any = config.config;
    const isStatusRequest: boolean = self.isServerRequestStatusCall(request);

    return (isStatusRequest && (data && data.outcome && data.result)) ?
      (data.outcome.constructor === String) && (data.outcome === "success") && (data.result.constructor === String) :
      undefined;
  }

  public static isServerRequestStatusCall(request: any): boolean {
    if (!request) {
      return undefined;
    }

    const correctRequest: any = (request.method && request.data) ?
      (request.method.constructor === String) && (request.method === "POST") &&
      (request.data.constructor === String) :
      undefined;

    if (!correctRequest) {
      return undefined;
    }

    const requestData: any = JSON.parse(request.data);

    return (requestData && requestData.address && requestData.name && requestData.operation) ?
      (requestData.address.constructor === Array) && (requestData.address.length === 0) &&
      (requestData.name.constructor === String) && (requestData.name === "launch-type") &&
      (requestData.operation.constructor === String) && (requestData.operation === "read-attribute") :
      undefined;
  }

  constructor(private $injector: any,
              private $q: ng.IQService) {
      ServerStatusInterceptor.ngInjector = $injector;
      ServerStatusInterceptor.ngQ = $q;
  }

  public responseError(config: any): any {
    const self: any = ServerStatusInterceptor.self;

    if (self.isServerRequestStatusCall(config.config)) {
      self.statusCallsFired = 0;
      self.serverStatusTimer = self.resetLastRequestTimer(self.serverStatusTimer, self);
    }

    return config;
  }

  public response(config: any): any {
    const self: any = ServerStatusInterceptor.self;

    if (self.isServerStausResponse(config, self)) {
      if (self.statusCallsFired <= self.maxStatusCalls) {
        self.serverStatusTimer = self.resetLastRequestTimer(self.serverStatusTimer, self);
      } else if (self.statusCallsFired >= self.maxStatusCalls) {
        self.statusCallsFired = 0;
        clearTimeout(self.serverStatusTimer);
      }
    } else if (!self.serverStatusTimer) {
      self.serverStatusTimer = self.resetLastRequestTimer(self.serverStatusTimer, self);
    }
    return config;
  }
};

module.service("serverStatusInterceptor", ServerStatusInterceptor);
