import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

export interface ChartOptions {
  title?: string;
  xAxisData?: string[];
  seriesData?: Array<{ name: string; data: number[]; color?: string }>;
  type?: 'line' | 'bar' | 'pie' | 'gauge';
  height?: string;
}

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  @Input() options: ChartOptions = {};
  
  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const isDark = true;
    
    // Base chart configuration
    const baseConfig: any = {
      backgroundColor: 'transparent',
      textStyle: {
        color: '#cbd5e1'
      },
      grid: {
        left: '40px',
        right: '20px',
        top: '20px',
        bottom: '30px',
        containLabel: true
      },
      title: this.options.title ? {
        text: this.options.title,
        textStyle: {
          color: '#e2e8f0',
          fontSize: 14,
          fontWeight: 'bold'
        },
        left: 'center',
        top: 0
      } : undefined
    };

    // Build chart based on type
    switch (this.options.type || 'line') {
      case 'line':
        this.chartOptions = {
          ...baseConfig,
          xAxis: {
            type: 'category',
            data: this.options.xAxisData || [],
            axisLine: { lineStyle: { color: '#4b5563' } },
            axisLabel: { color: '#94a3b8' }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#2d3748' } },
            axisLabel: { color: '#94a3b8' }
          },
          series: this.buildLineSeries(),
          tooltip: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)',
            borderColor: '#4b5563',
            textStyle: { color: '#e2e8f0' }
          }
        };
        break;

      case 'bar':
        this.chartOptions = {
          ...baseConfig,
          xAxis: {
            type: 'category',
            data: this.options.xAxisData || [],
            axisLine: { lineStyle: { color: '#4b5563' } },
            axisLabel: { color: '#94a3b8' }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#2d3748' } },
            axisLabel: { color: '#94a3b8' }
          },
          series: this.buildBarSeries(),
          tooltip: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)',
            borderColor: '#4b5563',
            textStyle: { color: '#e2e8f0' }
          }
        };
        break;

      case 'pie':
        this.chartOptions = {
          ...baseConfig,
          series: [{
            name: this.options.seriesData?.[0]?.name || 'Data',
            type: 'pie',
            radius: ['40%', '70%'],
            data: (this.options.seriesData?.[0]?.data || []).map((value, index) => ({
              value,
              name: `Item ${index + 1}`
            })),
            itemStyle: {
              borderColor: '#1a1f2e',
              borderWidth: 2
            }
          }],
          tooltip: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)',
            borderColor: '#4b5563',
            textStyle: { color: '#e2e8f0' }
          }
        };
        break;

      case 'gauge':
        this.chartOptions = {
          ...baseConfig,
          series: [{
            type: 'gauge',
            radius: '80%',
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [[0.3, '#ef4444'], [0.7, '#eab308'], [1, '#22c55e']]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 16
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              color: 'auto'
            },
            data: [{ value: this.options.seriesData?.[0]?.data?.[0] || 50, name: 'Health' }]
          }]
        };
        break;
    }
  }

  private buildLineSeries() {
    return (this.options.seriesData || []).map((series, index) => ({
      name: series.name,
      type: 'line',
      data: series.data,
      smooth: true,
      itemStyle: {
        color: series.color || this.getDefaultColor(index)
      },
      lineStyle: {
        color: series.color || this.getDefaultColor(index),
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: (series.color || this.getDefaultColor(index)) + '40' },
          { offset: 1, color: (series.color || this.getDefaultColor(index)) + '00' }
        ])
      }
    }));
  }

  private buildBarSeries() {
    return (this.options.seriesData || []).map((series, index) => ({
      name: series.name,
      type: 'bar',
      data: series.data,
      itemStyle: {
        color: series.color || this.getDefaultColor(index),
        borderRadius: [4, 4, 0, 0]
      }
    }));
  }

  private getDefaultColor(index: number): string {
    const colors = ['#5b6cff', '#38bdf8', '#22c55e', '#eab308', '#ef4444', '#8a7bff'];
    return colors[index % colors.length];
  }
}
