import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projects'
})
export class ProjectPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    if(!value.length) return[];
    let search = args[0];
    if(!search) {
      return value.slice();
    } else {
      search = search.trim().toLowerCase();
    }
    return value.filter(
    (value: any) =>
      value.name.toLowerCase().indexOf(search) > -1
    );
  }

}
