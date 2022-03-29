import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { PaginatorEvent } from "@shared/components/paginator/paginator.component";
import { QueryParameters, SortInfo } from "@shared/models/query-parameters";
import { CallState, StoreState } from "@shared/services/generic-store.service";
import { defaultDefinition, GenericListDefinition } from "@shared/services/schema.models";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { SubSink } from "subsink";

@Component({
  selector: 'smp-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit, OnDestroy {
  @Input() definition: GenericListDefinition = defaultDefinition;
  @Input() state: StoreState<any>;

  @Output() newClicked: EventEmitter<any> = new EventEmitter();
  @Output() refreshClicked: EventEmitter<QueryParameters> = new EventEmitter<QueryParameters>();
  @Output() paramsChanged: EventEmitter<QueryParameters> = new EventEmitter<QueryParameters>();
  @Output() tableClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() advancedSearch: EventEmitter<any> = new EventEmitter();
  @Output() paramsInitialised: EventEmitter<QueryParameters> = new EventEmitter<QueryParameters>();


  public CallStates = CallState;
  public searchForm: FormGroup;
  public currentParams: QueryParameters;

  private subs = new SubSink();
  private searchDelay: number = 400;

  constructor() { }

  ngOnInit(): void {
    // Prepare search form
    this.searchForm = new FormGroup({
      searchValue: new FormControl()
    });

    // Listen to search box changes
    this.subs.sink = this.searchForm.get('searchValue')
      .valueChanges
      .pipe(
        debounceTime(this.searchDelay),
        distinctUntilChanged()
      ).subscribe({
          next: (search: string) => {
            if (search !== this.currentParams.criteria[this.definition.searchProperty]) {
              this.currentParams.pageNumber = 1
            }
            this.currentParams = {
              ...this.currentParams,
              criteria: {[this.definition.searchProperty]: search}
            };
            this.onParamsChanged(this.currentParams);
          },
          error: err => console.error(err)
        }
      );

    // Read params and trigger params changed
    this.currentParams = GenericListComponent.getStoredParameters(this.definition.storageKey) || {
      pageNumber: 1,
      pageSize: this.definition.defaultPageSize,
      sort: {...this.definition.tableDefinition.defaultSort},
      criteria: {[this.definition.searchProperty]: ''}
    };
    this.paramsInitialised.emit(this.currentParams);

    // Check if we should trigger a load on storage
    if (this.state.callState == CallState.Initial) {
      this.searchForm.get('searchValue').setValue('');
    }
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  onClearSearch = (suppressEvent: boolean = false) => {
    this.searchForm.reset('', {emitEvent: !suppressEvent});
  }
  onNewClicked = () => this.newClicked.emit();
  onRefreshClicked = () => this.refreshClicked.emit(this.currentParams);
  onCellClicked = (event: any) => this.tableClicked.emit(event);

  onPaginatorChanges = (changes: PaginatorEvent) => {
    if (changes.pageNumber == this.currentParams.pageNumber &&
      changes.pageSize == this.currentParams.pageSize) { return; }

    this.currentParams = {
      ...this.currentParams,
      pageNumber: changes.pageNumber,
      pageSize: changes.pageSize
    };
    this.onParamsChanged(this.currentParams);
  }

  onSortChanged(changes: SortInfo) {
    if (changes.column == this.currentParams.sort.column &&
      changes.direction == this.currentParams.sort.direction) { return; }

    this.currentParams = {
      ...this.currentParams,
      sort: {
        column: changes.column,
        direction: changes.direction
      }
    };
    this.onParamsChanged(this.currentParams);
  }

  onParamsChanged(params: QueryParameters) {
    localStorage.setItem(this.definition.storageKey, JSON.stringify(params));
    this.paramsChanged.emit(params);
  }

  onAdvancedSearch = () => {
    if (!this.definition.enableAdvancedSearch) { return; }
    this.advancedSearch.emit();
  }

  private static getStoredParameters(key: string) {
    try {
      const values = localStorage.getItem(key);
      return JSON.parse(values);
    } catch {
      console.log(1)
      return null
    }
  }
}
