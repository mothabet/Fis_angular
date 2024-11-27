import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-without-trans-rep',
  templateUrl: './table-without-trans-rep.component.html',
  styleUrls: ['./table-without-trans-rep.component.css']
})
export class TableWithoutTransRepComponent implements OnInit{
  @Input() report:any;
  groupedFields: any[] = [];

  ngOnInit(): void {
    this.groupFieldsByActivityName();
  }

  groupFieldsByActivityName(): void {
    const groupedMap = new Map<string, any[]>();

    for (const field of this.report.fields) {
      const activityName = field.find((f : any) => f.key === 'activityName').value;
      if (!groupedMap.has(activityName)) {
        groupedMap.set(activityName, []);
      }
      groupedMap.get(activityName)!.push(field);
    }

    this.groupedFields = Array.from(groupedMap.entries()).map(([activityName, fields]) => ({
      activityName,
      fields
    }));
  }
}
