import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split2array'
})
export class Split2ArrayPipe implements PipeTransform {
  constructor() { }

  transform(value: string, separator: string): string[] {
    return value ? value.split(separator).filter(x => x) : [];
  }

}
