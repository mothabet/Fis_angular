import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-percentage-without-trans-rep',
  templateUrl: './percentage-without-trans-rep.component.html',
  styleUrls: ['./percentage-without-trans-rep.component.css']
})
export class PercentageWithoutTransRepComponent implements OnInit {
  @Input() report: any;
  ngOnInit(): void {
  }
  getUniqueActivities() {
    // إنشاء خريطة لتخزين الأنشطة الفريدة
    const activitiesMap = new Map();
    // مر على جميع الحقول في report
    this.report.fields.forEach((fieldGroup: any) => {
      
      // استخراج اسم النشاط
      const activityName = fieldGroup[5]?.value;
      
      // تأكد من صحة هذا
      const field = {
        codeName: fieldGroup[4]?.value,
        code: fieldGroup[3]?.value,
        totalCode1: fieldGroup[0]?.value,
        totalCode2: fieldGroup[1]?.value,
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

