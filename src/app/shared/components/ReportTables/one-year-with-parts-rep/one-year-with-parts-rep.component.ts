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
}
