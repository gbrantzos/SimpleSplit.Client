import { Injectable } from "@angular/core";
import { BuildingsApiClient } from "@features/buildings/services/buildings-api-client";
import { BaseModel } from "@shared/components/base-list/base-list.component";
import { GenericStoreService } from "@shared/services/generic-store.service";

export interface Building extends BaseModel {
  description: string;
}

@Injectable()
export class BuildingsStore extends GenericStoreService<Building> {
  constructor(private client: BuildingsApiClient) {super(client);}
}
