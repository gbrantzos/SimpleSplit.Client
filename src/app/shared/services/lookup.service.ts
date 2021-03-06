import { Injectable } from "@angular/core";
import { Lookup } from "@shared/services/schema.models";
import { map, Observable, of } from "rxjs";

interface CacheFactory {
  source: () => Observable<Map<string, string | any>>;
  cacheable: boolean
}

@Injectable({providedIn: "root"})
export class LookupService {
  private readonly lookupFactories: { [name: string]: CacheFactory } = {};
  private readonly cache: { [name: string]: Observable<Lookup> } = {};

  registerLookup(name: string, cacheable: boolean, source: () => Observable<Map<string, string | any>>) {
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
    if (!factory) {
      throw new Error(`Unknown lookup ${name}!`);
    }
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
