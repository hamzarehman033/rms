import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartOptions {
  title?: string;
  data: PieChartData[];
  height?: string;
  showLegend?: boolean;
  donut?: boolean;
}

@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule, NgxEchartsDirective, NgxEchartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements OnInit {
  @Input() options!: PieChartOptions;

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const colors = ['#5b6cff', '#38bdf8', '#22c55e', '#eab308', '#ef4444', '#8a7bff', '#06b6d4', '#ec4899'];

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
      legend: this.options.showLegend !== false ? {
        data: this.options.data.map(d => d.name),
        orient: 'vertical',
        right: 10,
        textStyle: { color: '#94a3b8', fontSize: 11 }
      } : undefined,
      series: [{
        name: 'Distribution',
        type: this.options.donut ? 'pie' : 'pie',
        radius: this.options.donut ? ['35%', '60%'] : '60%',
        center: ['40%', '50%'],
        data: this.options.data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color || colors[index % colors.length],
            borderColor: '#1a1f2e',
            borderWidth: 2
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          color: '#cbd5e1',
          fontSize: 11
        }
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
