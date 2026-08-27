import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pascalCase',
  standalone: true,
})
export class PascalCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .toLocaleLowerCase()
      .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
  }
}
