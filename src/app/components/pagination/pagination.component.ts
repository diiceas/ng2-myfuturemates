import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() pages: number;
  @Input() currentPage: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  pageClickedHandler(page: number): void {
    if (page >= 1 && page <= this.pages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  createRange(number) {
    let items = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}
