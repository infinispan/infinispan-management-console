export class MemoryData {

  constructor(private usedJVM: number,
              private maxJVM: number,
              private usedOffHeap: number,
              private maxOffHeap: number) {
  }

  public getUsedJVM(): number {
    // convert to GB
    return this.usedJVM;
  }

  public getUsedOffHeap(): number {
    // convert to GB
    return this.usedOffHeap;
  }

  public getMaxJVM(): number {
    // convert to GB
    return this.maxJVM;
  }

  public getMaxOffHeap(): number {
    // convert to GB
    return this.maxOffHeap;
  }

  public getTotalMemory(): number {
    return this.getMaxJVM() + this.getMaxOffHeap();
  }

  public getTotalUsedMemory(): number {
    return this.getUsedJVM() + this.getUsedOffHeap();
  }

  public getTotalFreeMemory(): number {
    return this.getTotalMemory() - this.getTotalUsedMemory();
  }
}
