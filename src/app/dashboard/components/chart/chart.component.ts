import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() title: string = 'Chart';
  @Input() chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  chartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        position: 'left',
        grid: {
          color: '#A0A0A0',
        },
        ticks: {
          color: '#1d273b',
        },
      },
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
