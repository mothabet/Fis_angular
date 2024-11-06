import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-two-years-with-parts-rep',
  templateUrl: './two-years-with-parts-rep.component.html',
  styleUrls: ['./two-years-with-parts-rep.component.css']
})
export class TwoYearsWithPartsRepComponent {
  @Input() report:any;
  getRowSpan(fields: any[], activityName: string): number {
    // Count how many times the activity (field[8].value) appears in the fields array
    return fields.filter(field => field[6].value === activityName).length;
  }
}
