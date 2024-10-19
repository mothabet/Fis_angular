import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-without-trans-rep',
  templateUrl: './table-without-trans-rep.component.html',
  styleUrls: ['./table-without-trans-rep.component.css']
})
export class TableWithoutTransRepComponent implements OnInit{
  @Input() report:any;
  ngOnInit(): void {
  }
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[8].value === activityName).length;
  }
}
