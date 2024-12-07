import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-year-with-parts-and-total-rep',
  templateUrl: './one-year-with-parts-and-total-rep.component.html',
  styleUrls: ['./one-year-with-parts-and-total-rep.component.css']
})
export class OneYearWithPartsAndTotalRepComponent implements OnInit {
  @Input() report:any;
  ngOnInit(): void {
  }
  getUniqueActivities() {
    // إنشاء خريطة لتخزين الأنشطة الفريدة
    const activitiesMap = new Map();
    // مر على جميع الحقول في report
    this.report.fields.forEach((fieldGroup: any) => {
      debugger
      // استخراج اسم النشاط
      const activityName = fieldGroup[6]?.value;
      // تأكد من صحة هذا
      const field = {
        codeName: fieldGroup[5]?.value,
        code: fieldGroup[4]?.value,
        totalCode1: fieldGroup[0]?.value,
        totalCode2: fieldGroup[1]?.value,
        totalCode3: fieldGroup[2]?.value,
      };

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
