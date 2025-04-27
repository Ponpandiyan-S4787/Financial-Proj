import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Investment, PortfolioService } from '../../core/services/portfolio.service';
import { CurrencyFormatPipe } from '../../core/pipes/currency-format.pipe';
import { CommonModule } from '@angular/common';
import { Chart,registerables } from 'chart.js';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    CurrencyFormatPipe,
  ],  
  standalone: true,
})
export class DashboardComponent implements OnInit {
  portfolioData: any;
  inverstmentData:any
  investments$: Observable<Investment[]>;
  // totalPortfolioValue: number = 0;
  private investmentSubscription: Subscription | undefined;
  private chart: Chart | undefined;
  @ViewChild('portfolioChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  

  constructor(private portfolioService: PortfolioService) {
    
    this.investments$ = this.portfolioService.getInvestments();
    Chart.register(...registerables); // Register Chart.js components
  }

  ngOnInit() {
    this.portfolioService.getPortfolioData().subscribe(data => {
      this.portfolioData = data;
  
    });
    this.portfolioService.getInvestments().subscribe(data => {
      this.inverstmentData = data;
    });
    this.investmentSubscription = this.investments$.subscribe((investments: any[]) => {
      // this.totalPortfolioValue = investments.reduce((sum, inv) => sum + (inv.currentValue ?? inv.purchasePrice * inv.quantity), 0);
      // Update chart data if the chart instance exists
      if (this.chart) {
        this.updateChartData(investments);
      }
    });
  }

  ngAfterViewInit(): void {
    // Ensure the view is initialized before creating the chart
    // Use a short delay or trigger chart creation after data is loaded
    this.investmentSubscription = this.investments$.subscribe((investments: any) => {
      if (investments && investments.length > 0 && this.chartRef) {
         // Check if chart already exists, destroy before creating new one
         if (this.chart) {
            this.chart.destroy();
         }
        this.createChart(investments);
      } else if (this.chart) {
          // Handle case where investments become empty
          this.chart.destroy();
          this.chart = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.investmentSubscription?.unsubscribe();
    this.chart?.destroy(); // Clean up chart instance
  }

  private createChart(investments: Investment[]): void {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const labels = investments.map(inv => inv.assetType);
    const data = investments.map(inv => inv.purchasePrice ?? inv.purchasePrice * inv.quantity);

    this.chart = new Chart(ctx, {
      type: 'line', // Changed from 'pie' to 'line'
      data: {
        labels: labels,
        datasets: [{
          label: 'Portfolio Value by Asset',
          data: data,
          fill: false, // Line charts typically aren't filled
          borderColor: 'rgb(75, 192, 192)', // Example line color
          tension: 0.1 // Makes the line slightly curved
          // Removed backgroundColor and borderWidth specific to pie/bar
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // Adjust as needed
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
             callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        // Format as currency (using context.parsed.y for line charts)
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
          }
        },
        scales: { // Scales are necessary for line charts
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Method to update chart data dynamically without recreating the chart
  private updateChartData(investments: Investment[]): void {
      if (!this.chart) return;

      const labels = investments.map(inv => inv.assetType);
      const data = investments.map(inv => inv.purchasePrice ?? inv.purchasePrice * inv.quantity);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      // Adjust dataset properties if needed for line chart update
      this.chart.data.datasets[0].borderColor = 'rgb(75, 192, 192)';
      // this.chart.data.datasets[0].fill = false;
      // Remove properties not applicable to line chart
      delete this.chart.data.datasets[0].backgroundColor;
      delete this.chart.data.datasets[0].borderWidth;

      this.chart.update();
  }
}