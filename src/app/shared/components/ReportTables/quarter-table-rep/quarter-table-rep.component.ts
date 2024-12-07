import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quarter-table-rep',
  templateUrl: './quarter-table-rep.component.html',
  styleUrls: ['./quarter-table-rep.component.css']
})
export class QuarterTableRepComponent implements OnInit{
  @Input() report:any;
  ngOnInit(): void {

  }
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[11].value === activityName).length;
  }
}
