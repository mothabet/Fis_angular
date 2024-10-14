import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-two-years-with-parts-rep',
  templateUrl: './two-years-with-parts-rep.component.html',
  styleUrls: ['./two-years-with-parts-rep.component.css']
})
export class TwoYearsWithPartsRepComponent {
  @Input() report:any;
}
