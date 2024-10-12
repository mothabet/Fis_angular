import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-with-trans-rep',
  templateUrl: './table-with-trans-rep.component.html',
  styleUrls: ['./table-with-trans-rep.component.css']
})
export class TableWithTransRepComponent implements OnInit {
  @Input() report:any;
  ngOnInit(): void {
  }
}
