import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';

export interface BarChartOptions {
  title?: string;
  xAxisData: string[];
  seriesData: Array<{ name: string; data: number[]; color?: string }>;
  height?: string;
  showLegend?: boolean;
  horizontal?: boolean;
}

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  @Input() options!: BarChartOptions;

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const colors = ['#5b6cff', '#38bdf8', '#22c55e', '#eab308', '#ef4444', '#8a7bff'];

    const isHorizontal = this.options.horizontal;

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
        left: isHorizontal ? '100px' : '50px',
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
        type: isHorizontal ? 'value' : 'category',
        data: isHorizontal ? undefined : this.options.xAxisData,
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      yAxis: {
        type: isHorizontal ? 'category' : 'value',
        data: isHorizontal ? this.options.xAxisData : undefined,
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#2d3748' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      series: this.options.seriesData.map((series, index) => ({
        name: series.name,
        type: 'bar',
        data: series.data,
        itemStyle: {
          color: series.color || colors[index % colors.length],
          borderRadius: [4, 4, 0, 0]
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
