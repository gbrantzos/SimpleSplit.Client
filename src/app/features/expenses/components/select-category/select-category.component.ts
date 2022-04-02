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

  constructor(lookupService: LookupService) {
    this.categories$ = lookupService
      .getLookup('EXPENSES::CATEGORIES')
      .pipe(map(lookup => lookup.items));
  }

  ngOnInit(): void { }

  asIsOrder(a, b) { return 1; }
}
