import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-with-trans-rep',
  templateUrl: './table-with-trans-rep.component.html',
  styleUrls: ['./table-with-trans-rep.component.css']
})
export class TableWithTransRepComponent implements OnInit {
  @Input() report:any;
  ngOnInit(): void {
    const temp = this.report
  }
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[9].value === activityName).length;
  }
}
