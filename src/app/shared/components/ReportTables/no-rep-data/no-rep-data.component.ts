import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-rep-data',
  templateUrl: './no-rep-data.component.html',
  styleUrls: ['./no-rep-data.component.css']
})
export class NoRepDataComponent {
  @Input() report:any;
}
