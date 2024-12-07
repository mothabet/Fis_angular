import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-with-periods-rep',
  templateUrl: './table-with-periods-rep.component.html',
  styleUrls: ['./table-with-periods-rep.component.css']
})
export class TableWithPeriodsRepComponent implements OnInit {
  @Input() report: any;
  years: number[] = [];
  ngOnInit(): void {
    if (this.report.seconedTable == 'Years')
      this.generateYearsList(this.report.fields[0][7].value);
    else
      this.generateYearsList(this.report.fields[0][8].value);
  }
  generateYearsList(period: number): void {
    for (let i = 0; i < period; i++) {
      if (this.report.seconedTable == 'Years')
        this.years.push(+this.report.fields[0][4].value + i);
      else
        this.years.push(+this.report.fields[0][5].value + i);
    }
  }
  getUniqueActivities() {
    // إنشاء خريطة لتخزين الأنشطة الفريدة
    const activitiesMap = new Map();
    // مر على جميع الحقول في report
    this.report.fields.forEach((fieldGroup: any) => {
      // استخراج اسم النشاط
      const activityName = fieldGroup[2]?.value;
      // تأكد من صحة هذا
      const field: any = {
        codeName: fieldGroup[1]?.value,
        code: fieldGroup[0]?.value,
      };

      // توليد الحقول الديناميكية بناءً على السنوات
      this.years.forEach((_, index) => {
        const adjustedIndex = index + 10; // بدء الفهرس من 10
        field[`totalCode${index + 1}`] = fieldGroup[adjustedIndex]?.value;
      });
      debugger
      // إضافة الأنشطة إذا كانت جديدة
      if (!activitiesMap.has(activityName)) {
        activitiesMap.set(activityName, {
          activityName: activityName,
          fields: []
        });
      }

      // إضافة الحقول الخاصة بالنشاط
      activitiesMap.get(activityName).fields.push(field);
    });

    // تحويل الخريطة إلى مصفوفة وإرجاعها
    return Array.from(activitiesMap.values());
  }
}
