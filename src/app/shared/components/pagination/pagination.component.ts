import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() pageNumber!: number;
  @Input() emptyData!: boolean;
  @Input() lastPage!: boolean;
  @Input() pagesCount!: number;
  @Output() pageChange = new EventEmitter();
  Pagination(pageNumber: number){
    
    if (pageNumber > 0 && pageNumber <= this.pagesCount) {
      this.pageChange.emit(pageNumber);
    }
  }
}
