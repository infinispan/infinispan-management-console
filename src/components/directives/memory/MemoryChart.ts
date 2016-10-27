/// <reference path="../../../../typings/globals/d3/index.d.ts" />
/// <reference path="../../../../typings/globals/c3/index.d.ts" />

import * as c3 from "c3";
import {MemoryData} from "../../memory/MemoryData";

export class MemoryChart {
  chart: c3.ChartAPI;

  constructor(bindTo: string, private data: MemoryData) {
    this.chart = c3.generate({
      bindto: bindTo,
      size: {
        width: 220,
        height: 220
      },
      data: {
        columns: [
          ["JVM", this.data.getUsedJVM()],
          ["Off-heap", this.data.getUsedOffHeap()],
          ["Free", this.data.getTotalUsedMemory()]
        ],
        type: "donut"
      },
      donut: {
        title: "" + this.data.getTotalMemory() + " GB"
      }
    });
  }

  public getMemoryData(): MemoryData {
    return this.data;
  }

  redraw(): void {
    this.chart.flush();
  }

  destroy(): void {
    this.chart.destroy();
  }
}

