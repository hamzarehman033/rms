import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';

export interface GaugeChartOptions {
  title?: string;
  value: number;
  max?: number;
  height?: string;
  unit?: string;
  name?: string;
  color?: string;
}

@Component({
  selector: 'app-gauge-chart',
  imports: [CommonModule, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.css'
})
export class GaugeChartComponent implements OnInit {
  @Input() options!: GaugeChartOptions;

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const max = this.options.max || 100;
    const value = Math.min(this.options.value, max);

    // Determine color based on value
    let color = this.options.color;
    if (!color) {
      if (value >= 75) color = '#22c55e'; // green
      else if (value >= 50) color = '#eab308'; // yellow
      else if (value >= 25) color = '#f97316'; // orange
      else color = '#ef4444'; // red
    }

    this.chartOptions = {
      backgroundColor: 'transparent',
      textStyle: {
        color: '#cbd5e1'
      },
      title: this.options.title ? {
        text: this.options.title,
        textStyle: {
          color: '#e2e8f0',
          fontSize: 14,
          fontWeight: 'bold'
        },
        left: 'center',
        top: 10
      } : undefined,
      series: [{
        type: 'gauge',
        radius: '75%',
        center: ['50%', '60%'],
        min: 0,
        max: max,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [0.25, '#ef4444'],
              [0.5, '#f97316'],
              [0.75, '#eab308'],
              [1, '#22c55e']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: color
          }
        },
        axisTick: {
          distance: -25,
          length: 6,
          lineStyle: {
            color: '#1a1f2e',
            width: 1
          }
        },
        splitLine: {
          distance: -25,
          length: 20,
          lineStyle: {
            color: '#1a1f2e',
            width: 2
          }
        },
        axisLabel: {
          color: '#94a3b8',
          distance: 25,
          fontSize: 10
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}${this.options.unit || ''}`,
          color: color,
          fontSize: 16,
          fontWeight: 'bold',
          offsetCenter: [0, '60%']
        },
        data: [
          {
            value: value,
            name: this.options.name || ''
          }
        ]
      }],
      tooltip: {
        backgroundColor: 'rgba(45, 55, 72, 0.95)',
        borderColor: '#4b5563',
        textStyle: { color: '#e2e8f0' },
        trigger: 'item'
      }
    };
  }
}
