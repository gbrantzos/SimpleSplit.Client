import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagedResult } from "@shared/models/paged-result";

export interface PaginatorEvent {
  pageNumber: number;
  pageSize: number;
}


@Component({
  selector: 'smp-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() sizes: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;
  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() totalRows: number;
  @Output() changes: EventEmitter<PaginatorEvent> = new EventEmitter<PaginatorEvent>();

  private maxPages = 9;
  private isCompact: boolean = false;
  public links: string[];

  constructor() { }

  ngOnInit(): void {
    this.links = this.prepareLinks();
  }

  onSizeSelected(size: number) {
    if (size == this.pageSize) { return; }
    const event = {
      pageNumber: this.currentPage,
      pageSize: size
    } as PaginatorEvent;
    this.changes.emit(event);
  }

  onPageSelected(link: string) {
    if (!this.isNumber(link)) { return; }

    const pageNumber = Number(link);
    if (pageNumber == this.currentPage) { return; }
    const event = {
      pageNumber: Number(link),
      pageSize: this.pageSize
    } as PaginatorEvent;
    this.changes.emit(event);
  }

  isNumber = (link: any) => !isNaN(link)

  dataInfo(): string {
    if (this.totalRows === 0) {
      return '';
    }

    const from = (this.currentPage - 1) * this.pageSize + 1;
    const to = Math.min((this.currentPage) * this.pageSize, this.totalRows);
    return `Εμφάνιση ${from} - ${to} από σύνολο ${this.totalRows} εγγραφών`;
  }

  private prepareLinks() {
    if (this.totalPages <= this.maxPages) {
      return [...Array(this.totalPages)].map((_, i) => (i + 1).toString());
    }

    const links = [];
    let low = this.currentPage;
    let high = this.currentPage;
    links.push(this.currentPage.toString());
    if (low - 1 >= 1) {
      low--;
      links.unshift(low.toString());
    }
    if (!this.isCompact && low - 1 >= 1) {
      low--;
      links.unshift(low.toString());
    }
    if (high + 1 <= this.totalPages) {
      high++;
      links.push(high.toString());
    }
    if (!this.isCompact && high + 1 <= this.totalPages) {
      high++;
      links.push(high.toString());
    }

    if (this.totalPages - high >= 3) {
      if (!this.isCompact) { links.push((high + 1).toString()); }
      links.push("...");
      links.push(this.totalPages.toString());

      high++;
    } else {
      while (high < this.totalPages) {
        high++;
        links.push((high).toString());
      }
    }

    if (low >= 3) {
      links.unshift("...");
      links.unshift("1");
    }
    if (low == 2) { links.unshift("1");}

    return links;
  }
}
