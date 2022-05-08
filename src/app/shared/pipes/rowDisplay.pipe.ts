import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'rowDisplay'})
export class RowDisplayPipe implements PipeTransform {
  constructor() { }

  transform(row: any, displayProperty: string, callback?: any): any {
    if (typeof callback == 'function') {
      return callback(row);
    }
    return row[displayProperty];
  }
}
