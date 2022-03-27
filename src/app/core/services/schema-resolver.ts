import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import { Lookup, Schema } from "@core/services/schema.models";
import { forkJoin, map, mergeMap, Observable, of } from "rxjs";

@Injectable({providedIn: "root"})
export class SchemaResolver implements Resolve<Observable<Schema>> {
  constructor(private httpClient: HttpClient, private lookupService: LookupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Schema> {
    const definition = route.data['definitionFile'];
    const schemaJson = `${definition}.json`;

    return this
      .httpClient
      .get<Schema>(`assets/ui/${schemaJson}`)
      .pipe(
        mergeMap(schema => {
          // Get all lookups by name
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
        })
      );
  }
}
