
export interface ICounter {
  getName(): string;
  getStorage(): string;
  getInitialValue(): number;
  getCurrentValue(): number;
  toString(): string;
}
