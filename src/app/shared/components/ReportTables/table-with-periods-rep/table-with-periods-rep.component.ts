import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-with-periods-rep',
  templateUrl: './table-with-periods-rep.component.html',
  styleUrls: ['./table-with-periods-rep.component.css']
})
export class TableWithPeriodsRepComponent implements OnInit{
  @Input() report:any;
  years: number[] = [];
  ngOnInit(): void {
    this.generateYearsList(this.report.fields[0][4].value);
    console.log(this.report)
    
  }
  generateYearsList(period: number): void {
    for (let i = 0; i < period; i++) {
      this.years.push(+this.report.fields[0][0].value + i);
    }
  }
}
