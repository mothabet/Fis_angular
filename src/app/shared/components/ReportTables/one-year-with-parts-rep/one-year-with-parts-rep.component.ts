import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-year-with-parts-rep',
  templateUrl: './one-year-with-parts-rep.component.html',
  styleUrls: ['./one-year-with-parts-rep.component.css']
})
export class OneYearWithPartsRepComponent implements OnInit {
  @Input() report:any;
  ngOnInit(): void {
  }
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[8].value === activityName).length;
  }
}
