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
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[2].value === activityName).length;
  }
}
