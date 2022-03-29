import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import { LookupService } from "@shared/services/lookup.service";
import { Schema } from "@shared/services/schema.models";
import { mergeMap, Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class SchemaResolver implements Resolve<Observable<Schema>> {
  constructor(private httpClient: HttpClient,
              private lookupService: LookupService,
              private lookupResolver: LookupValuesResolver) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Schema> {
    const definition = route.data['definitionFile'];
    const schemaJson = `${definition}.json`;

    return this
      .httpClient
      .get<Schema>(`assets/ui/${schemaJson}`)
      .pipe(
        mergeMap(schema => this.lookupResolver.resolveSchema(schema))
      );
  }
}
