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
          // تعديل البيانات لإضافة السنوات المفقودة
          this.generalIndicatorsCharts.forEach((chart: any) => {
            const endYear = chart.yearTo === 0 ? currentYear : chart.yearTo;

            for (let year = chart.yearFrom; year <= endYear; year++) {
              if (chart.isSector) {
                // التحقق من sectorId عند التعامل مع قطاع
                if (!chart.yearTotal.some((item: any) => item.sectorId === year.toString())) {
                  chart.yearTotal.push({ sectorId: year.toString(), total: 0 });
                }
              } else {
                // التحقق من السنة عند التعامل مع السنوات
                if (!chart.yearTotal.some((item: any) => item.year === year.toString())) {
                  chart.yearTotal.push({ year: year.toString(), total: 0 });
                }
              }
            }

            // ترتيب البيانات
            if (chart.isSector) {
              // ترتيب البيانات حسب sectorId
              chart.yearTotal.sort((a: any, b: any) => parseInt(a.sectorId) - parseInt(b.sectorId));
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
    debugger
    const canvasId = 'chart-' + index;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!ctx) {
      console.error(`Canvas element with ID ${canvasId} not found.`);
      return;
    }

    // إذا كان هناك رسم بياني موجود بالفعل لهذا المعرف، يتم تدميره
    if (this.chartsMap.has(canvasId)) {
      this.chartsMap.get(canvasId)?.destroy();
    }

    const isPieChart = chart.chartType === 3; // تحقق إذا كان النوع Pie
    const newChart = new Chart<keyof ChartTypeRegistry, any[], any>(ctx, {
      type: chart.chartType === 1 ? 'bar' : chart.chartType === 2 ? 'line' : 'pie', // تحديد نوع الرسم البياني
      data: {
        labels: isPieChart
          ? chart.yearTotal.map(() => '') // إخفاء التسميات إذا كان Pie
          : chart.yearTotal.map((item: any) => item.year), // إظهار السنوات في الأنواع الأخرى
        datasets: [
          {
            label: '', // عنوان الرسم البياني
            data: chart.yearTotal.map((item: any) => item.total), // الإجماليات
            backgroundColor: chart.yearTotal.map(() => this.getRandomColor()), // ألوان الأعمدة
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: isPieChart
          ? undefined // إزالة المحاور إذا كان نوع الرسم Pie
          : {
            x: {
              title: {
                display: true,
                text: chart.isSector ? ' ' : '', // التبديل بناءً على isSector
              },
              ticks: {
                callback: function (value: string | number, index: number, ticks: any[]) {
                  if (chart.isSector) {
                    const sectorName = chart.yearTotal[index]?.year || ''; // جلب اسم القطاع
                    const maxLength = 30; // الحد الأقصى لعدد الأحرف

                    // إذا كان اسم القطاع أطول من 20 حرفًا، يتم تقليصه وإضافة "..."
                    if (sectorName.length > maxLength) {
                      return sectorName.substring(0, maxLength) + '...';
                    } else {
                      return sectorName; // إذا كان اسم القطاع أقل من أو يساوي 20 حرفًا
                    }
                  } else {
                    const year = chart.yearTotal[index]?.year; // جلب السنة من البيانات
                    return year ? year : value.toString(); // إذا كانت السنة موجودة، عرضها، وإلا عرض القيمة الرقمية
                  }
                },
                autoSkip: false, // عدم تخطي القيم
                maxRotation: 90, // تدوير النص بزاوية 90 درجة لتحسين العرض
                minRotation: 0, // لا يوجد تدوير إذا كانت النصوص صغيرة
                align: 'center', // محاذاة النصوص إلى المنتصف
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
            callbacks: {
              label: (tooltipItem: any) => {
                const year = chart.yearTotal[tooltipItem.dataIndex]?.year;
                const value = tooltipItem.raw;
                if (chart.isSector) {
                  // عرض اسم القطاع إذا كان isSector = true
                  const sectorName = chart.yearTotal[tooltipItem.dataIndex]?.sectorName || 'اسم القطاع غير متوفر';
                  const value = tooltipItem.raw;
                  return `اسم القطاع: ${year}, القيمة: ${value}`;
                } else {
                  // عرض السنة إذا لم يكن isSector
                  const year = chart.yearTotal[tooltipItem.dataIndex]?.year;
                  const value = tooltipItem.raw;
                  return `السنة: ${year}, القيمة: ${value}`;
                }
              },
            },
          },
          legend: {
            display: false, // إخفاء الشرح لجميع الأنواع
          },
        },
      },
    });

    this.chartsMap.set(canvasId, newChart); // تخزين الرسم البياني
  }

  getRandomColor(): string {
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);
    return `rgb(${R},${G},${B})`;
  }
}
