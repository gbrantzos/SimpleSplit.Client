import { Injectable } from "@angular/core";
import { Lookup, LookupItems } from "@core/services/schema.models";
import { map, Observable, of } from "rxjs";

interface CacheFactory {
  source: () => Observable<LookupItems>;
  cacheable: boolean
}

@Injectable({providedIn: "root"})
export class LookupService {
  private readonly lookupFactories: { [name: string]: CacheFactory } = {};
  private readonly cache: { [name: string]: Observable<Lookup> } = {};

  registerLookup(name: string, cacheable: boolean, source: () => Observable<LookupItems>) {
    this.lookupFactories[name] = {
      source,
      cacheable
    }
  }

  getLookup(name: string, refreshCache = false): Observable<Lookup> {
    let cached = this.cache[name];
    if (refreshCache) {
      cached = undefined;
    }
    if (cached) {
      // console.log('Cache hit => ' + name);
      return cached;
    }

    const factory = this.lookupFactories[name];
    return factory.source()
      .pipe(map(lookupItems => {
        const result = {
          name,
          cacheable: true,
          items: lookupItems
        };
        if (factory.cacheable) { this.cache[name] = of(result); }
        return result;
      }));
  }
}
