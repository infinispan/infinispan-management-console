import {ICounter} from "./ICounter";

export abstract class AbstractCounter implements ICounter {

  constructor(protected name: string, protected storage: string,
              protected initialValue: number, protected currentValue: number) {
  }

  public getName(): string {
    return this.name;
  }

  public getStorage(): string {
    return this.storage;
  }

  public getInitialValue(): number {
    return this.initialValue;
  }

  public getCurrentValue(): number {
    return this.currentValue;
  }
}
