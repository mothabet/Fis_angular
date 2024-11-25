import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeService } from '../../Services/home.service';

Chart.register(
  CategoryScale,     // Register Category Scale for x-axis
  LinearScale,       // Register Linear Scale for y-axis
  Title,             // Register title plugin
  Tooltip,           // Register tooltip plugin
  Legend,            // Register legend plugin
  BarController,     // Register Bar chart controller
  BarElement         // Register Bar element
);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  private chart: any;
  showLoader: boolean = false;
  public chartData = [
    { t: '2024-01-01', o: 0, h: 105 },
    { t: '2024-01-02', o: 0, h: 108 },
    { t: '2024-01-03', o: 0, h: 110 },
    { t: '2024-01-04', o: 0, h: 112 },
    { t: '2024-01-05', o: 0, h: 115 }
  ];
  generalIndicatorsCharts: any[] = []
  chartsMap: Map<string, Chart> = new Map(); // خريطة لتخزين المخططات حسب معرفها

  constructor(private sharedService: SharedService, private homeServices: HomeService) { }

  ngOnInit() {
    this.GetGeneralIndicatorsChart();
  }

  GetGeneralIndicatorsChart() {
    this.showLoader = true;
    const currentYear = new Date().getFullYear();

    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.generalIndicatorsCharts = res.Data;

          // تعديل البيانات لإضافة السنوات المفقودة
          this.generalIndicatorsCharts.forEach((chart: any) => {
            const endYear = chart.yearTo === 0 ? currentYear : chart.yearTo;

            for (let year = chart.yearFrom; year <= endYear; year++) {
              if (!chart.yearTotal.some((item: any) => item.year === year.toString())) {
                chart.yearTotal.push({ year: year.toString(), total: 0 });
              }
            }

            // ترتيب البيانات
            chart.yearTotal.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
          });

          // إنشاء الرسوم البيانية
          setTimeout(() => {
            this.generalIndicatorsCharts.forEach((chart: any, index: number) => {
              this.createChart(chart, index);  // تمرير chart و index إلى دالة createChart
            });

          }, 0);
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };

    this.homeServices.GetGeneralIndicatorsChart(0).subscribe(observer);
  }


  createChart(chart: any, index: number): void {
    // تحقق من وجود codeName
    if (!chart.codeName) {
      console.error('chart.codeName is undefined or empty.');
      return;
    }

    const canvasId = 'chart-' + index; // استخدم index كـ id
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!ctx) {
      console.error(`Canvas element for ${canvasId} not found.`);
      return;
    }

    // إذا كان هناك رسم بياني موجود بالفعل لهذا المعرف، يتم تدميره
    if (this.chartsMap.has(canvasId)) {
      this.chartsMap.get(canvasId)?.destroy();
    }

    const newChart = new Chart(ctx, {
      type: 'bar', // نوع الرسم البياني
      data: {
        labels: chart.yearTotal.map((item: any) => item.year), // محور X: السنوات
        datasets: [
          {
            label: '', // عنوان الرسم البياني
            data: chart.yearTotal.map((item: any) => item.total), // محور Y: الإجماليات
            backgroundColor: chart.yearTotal.map(() => this.getRandomColor()), // ألوان الأعمدة
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'السنة', // عنوان المحور X
            },
          },
          y: {
            title: {
              display: true,
              text: 'الإجمالي', // عنوان المحور Y
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
          },
          legend: {
            display: false, // تعطيل الشرح (legend)
          },
        },
      },
    });

    // تخزين الرسم البياني في الخريطة
    this.chartsMap.set(canvasId, newChart);
  }


  getRandomColor(): string {
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);
    return `rgb(${R},${G},${B})`;
  }


}
