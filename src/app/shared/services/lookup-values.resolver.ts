import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LookupService } from "@shared/services/lookup.service";
import { FormDefinition, Lookup, Schema } from "@shared/services/schema.models";
import { firstValueFrom, forkJoin, map, Observable, of } from "rxjs";

@Injectable({providedIn: "root"})
export class LookupValuesResolver {

  constructor(private httpClient: HttpClient, private lookupService: LookupService) {}

  resolveSchema(schema: Schema): Observable<Schema> {
    const listLookups = schema.listDefinition
      .tableDefinition
      .availableColumns
      .filter(d => d.lookupName)
      .map(d => d.lookupName) ?? [];
    const searchLookups = schema.searchDefinition?.filter(d => d.lookupName).map(d => d.lookupName) ?? [];
    const lookupNames = [...listLookups, ...searchLookups];
    if (lookupNames.length == 0) {
      return of(schema);
    }

    // Prepare a fork call to resolve all lookups
    const forkSources = {};
    lookupNames.forEach(n => forkSources[n] = this.lookupService.getLookup(n));
    return forkJoin(forkSources)
      .pipe(map(items => {
        for (const [key, value] of Object.entries(items)) {
          const listLookup = schema.listDefinition.tableDefinition.availableColumns.find(d => d.lookupName === key);
          if (!!listLookup) { listLookup.lookupValues = (value as Lookup).items; }
          const searchLookup = schema.searchDefinition?.find(d => d.lookupName === key);
          if (!!searchLookup) { searchLookup.lookupValues = (value as Lookup).items }
        }
        return schema;
      }))
  }

  resolveLookups(lookupNames: string[], refreshCache = false): Promise<Lookup[]>{
    const forkSources = [];
    lookupNames.forEach(n => forkSources.push(this.lookupService.getLookup(n, refreshCache)));
    return firstValueFrom(forkJoin(forkSources));
  }

  async resolveForm(formDefinition: FormDefinition): Promise<FormDefinition> {
    const lookupItems = formDefinition.items.filter(i => !!i.lookupName);
    const resolved = await this.resolveLookups(lookupItems.map(i => i.lookupName));

    lookupItems.forEach(item => {
      const lookup = resolved.find(l => l.name == item.lookupName);
      item.lookupValues = lookup.items;
    })

    return formDefinition;
  }
}
