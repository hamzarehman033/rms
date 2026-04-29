import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

export interface LineChartOptions {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{ name: string; data: number[]; color?: string }>;
  height?: string;
  showLegend?: boolean;
  smooth?: boolean;
}

@Component({
  selector: 'app-line-chart',
  imports: [CommonModule, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  @Input() options!: LineChartOptions;

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const colors = ['#5b6cff', '#38bdf8', '#22c55e', '#eab308', '#ef4444', '#8a7bff'];

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
      grid: {
        left: '50px',
        right: '20px',
        top: this.options.title ? '50px' : '20px',
        bottom: '30px',
        containLabel: true
      },
      legend: this.options.showLegend !== false ? {
        data: this.options.seriesData.map(s => s.name),
        bottom: -10,
        textStyle: { color: '#94a3b8' }
      } : undefined,
      xAxis: {
        type: 'category',
        data: this.options.xAxisData,
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#2d3748' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      series: this.options.seriesData.map((series, index) => ({
        name: series.name,
        type: 'line',
        data: series.data,
        smooth: this.options.smooth !== false,
        itemStyle: {
          color: series.color || colors[index % colors.length]
        },
        lineStyle: {
          color: series.color || colors[index % colors.length],
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: (series.color || colors[index % colors.length]) + '40' },
            { offset: 1, color: (series.color || colors[index % colors.length]) + '00' }
          ])
        }
      })),
      tooltip: {
        backgroundColor: 'rgba(45, 55, 72, 0.95)',
        borderColor: '#4b5563',
        textStyle: { color: '#e2e8f0' },
        trigger: 'axis'
      }
    };
  }
}
