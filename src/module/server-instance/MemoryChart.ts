/// <reference path="../../../typings/globals/d3/index.d.ts" />
/// <reference path="../../../typings/globals/c3/index.d.ts" />

import * as c3 from "c3";
export class InstanceMemoryChart {
    chart: c3.ChartAPI;

    constructor(bindTo: string, used: number, max: number) {
        this.chart = c3.generate({
            bindto: bindTo,
            size: {
                width: 220,
                height: 220
            },
            data: {
                columns: [["Used", used], ["Free", max]],
                type: "donut"
            },
            donut: {
                title: "Memory"
            }

        });
    }

    redraw(): void {
        this.chart.flush();
    }

    destroy(): void {
        this.chart.destroy();
    }
}

