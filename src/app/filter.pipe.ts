import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: any): any {
    if (!items || !searchText) {
        return [];
    }
    return items.filter(item => item.PPTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }

}
