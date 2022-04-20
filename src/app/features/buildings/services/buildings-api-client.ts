import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Building } from "@features/buildings/services/buildings-store";
import { GenericApiClient } from "@shared/services/generic-api.client";

@Injectable()
export class BuildingsApiClient extends GenericApiClient<Building> {
  constructor(httpClient: HttpClient) {
    super(`${environment.apiUrl}/buildings`, httpClient);
  }
}
