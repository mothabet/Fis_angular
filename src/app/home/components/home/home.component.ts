import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement, PieController, ArcElement, ChartTypeRegistry, LineController, LineElement, PointElement, Tick } from 'chart.js';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeService } from '../../Services/home.service';

Chart.register(
  CategoryScale,     // للمحور X
  LinearScale,       // للمحور Y
  BarController,     // لرسم الأعمدة
  BarElement,        // العناصر الفردية للأعمدة
  PieController,     // لرسم الدوائر
  ArcElement,        // العناصر الفردية للدوائر
  LineController,    // لرسم الخطوط
  LineElement,       // العناصر الفردية للخطوط
  PointElement,      // لرسم النقاط
  Tooltip,           // لتفعيل التلميحات عند التمرير
  Legend             // لتفعيل الشرح (Legend)
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
  chartsMap: Map<string, Chart> = new Map();

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
          debugger
          // تعديل البيانات لإضافة السنوات المفقودة
          this.generalIndicatorsCharts.forEach((chart: any) => {
            const endYear = chart.yearTo === 0 ? currentYear : chart.yearTo;

            for (let year = chart.yearFrom; year <= endYear; year++) {
              // if (chart.isSector) {
              //   // التحقق من sectorId عند التعامل مع قطاع
              //   if (!chart.yearTotal.some((item: any) => item.year === year.toString())) {
              //     chart.yearTotal.push({ year: year.toString(), total: 0 });
              //   }
              // } else {

              // التحقق من السنة عند التعامل مع السنوات
              if (!chart.isSector) {
                if (!chart.yearTotal.some((item: any) => item.year === year.toString())) {
                  chart.yearTotal.push({ year: year.toString(), total: 0 });
                }
              }
            }

            // ترتيب البيانات
            if (chart.isSector) {
              // ترتيب البيانات حسب sectorId
              chart.yearTotal.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
            } else {
              // ترتيب البيانات حسب السنة
              chart.yearTotal.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
            }
          });


          // إنشاء الرسوم البيانية
          setTimeout(() => {
            this.generalIndicatorsCharts.forEach((chart: any, index: number) => {
              debugger
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
    const canvasId = 'chart-' + index;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
  
    if (!ctx) {
      console.error(`Canvas element with ID ${canvasId} not found.`);
      return;
    }
  
    // تدمير الرسم البياني السابق إذا كان موجودًا
    if (this.chartsMap.has(canvasId)) {
      this.chartsMap.get(canvasId)?.destroy();
    }
  
    const isPieChart = chart.chartType === 3; // تحقق إذا كان النوع Pie
    const totalValues = chart.yearTotal.map((item: any) => item.total || 0); // القيم الإجمالية
    const labels = chart.yearTotal.map((item: any) =>
      chart.isSector ? item.year || 'اسم القطاع غير متوفر' : item.year || 'السنة غير متوفرة'
    ); // إعداد التسميات بناءً على نوع المخطط
  
    const hasData = totalValues.some((value: number) => value > 0); // التحقق إذا كان هناك بيانات
  
    const newChart = new Chart<keyof ChartTypeRegistry, any[], any>(ctx, {
      type: chart.chartType === 1 ? 'bar' : chart.chartType === 2 ? 'line' : 'pie',
      data: {
        labels, // أسماء السنوات أو القطاعات
        datasets: [
          {
            label: chart.isSector ? 'القطاعات' : 'السنة',
            data: totalValues, // القيم الحقيقية (بدون تغيير)
            backgroundColor: chart.yearTotal.map(() => this.getRandomColor()),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem: any) => {
                const value = tooltipItem.raw;
                const label = labels[tooltipItem.dataIndex];
                return `التسمية: ${label}, القيمة: ${value}`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: 'no-data-label',
          beforeDraw: (chart: any) => {
            if (isPieChart && !hasData) {
              const ctx = chart.ctx;
              const width = chart.width;
              const height = chart.height;
  
              ctx.save();
  
              // عرض الأيقونة
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold 50px Arial';
              ctx.fillStyle = '#f0ad4e'; // لون أصفر مشابه للـ alert
              ctx.fillText('⚠', width / 2, height / 2 - 40);
  
              // عرض النص الرئيسي
              ctx.font = '20px Arial';
              ctx.fillStyle = '#333'; // لون النص
              ctx.fillText('لا يوجد بيانات', width / 2, height / 2 + 20);
  
              ctx.restore();
            }
          },
        },
      ],
    });
  
    this.chartsMap.set(canvasId, newChart); // حفظ الرسم البياني الجديد
  }
  
  getRandomColor(): string {
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);
    return `rgb(${R},${G},${B})`;
  }
}
