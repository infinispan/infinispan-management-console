import {AbstractCounter} from "./AbstractCounter";
import {WEAK_COUNTER} from "./CounterService";

export class WeakCounter extends AbstractCounter {

  constructor(name: string, storage: string, initialValue: number, currentValue: number,
              protected concurrency: number) {
    super(name, storage, initialValue, currentValue);
  }

  getConcurrency(): number {
    return this.concurrency;
  }

  toString(): string {
    return WEAK_COUNTER;
  }
}
