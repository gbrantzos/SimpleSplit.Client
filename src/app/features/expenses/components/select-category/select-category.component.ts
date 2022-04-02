import { Component, OnInit } from '@angular/core';
import { LookupService } from "@shared/services/lookup.service";
import { map } from "rxjs";

@Component({
  selector: 'smp-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss']
})
export class SelectCategoryComponent implements OnInit {
  public categories$;

  constructor(private lookupService: LookupService) {
    this.categories$ = lookupService
      .getLookup('EXPENSES::CATEGORIES')
      .pipe(map(lookup => lookup.items));
  }

  ngOnInit(): void { }

  async onRefreshSelect(event: MouseEvent) {
    event.stopPropagation();
    this.categories$ = this.lookupService
      .getLookup('EXPENSES::CATEGORIES', true)
      .pipe(map(lookup => lookup.items));
  }

  asIsOrder(a, b) { return 1; }
}
