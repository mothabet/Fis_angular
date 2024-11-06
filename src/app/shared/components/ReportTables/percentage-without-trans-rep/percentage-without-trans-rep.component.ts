import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-percentage-without-trans-rep',
  templateUrl: './percentage-without-trans-rep.component.html',
  styleUrls: ['./percentage-without-trans-rep.component.css']
})
export class PercentageWithoutTransRepComponent implements OnInit{
  @Input() report:any;
  ngOnInit(): void {
  }
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[5].value === activityName).length;
  }
}

