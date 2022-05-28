import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

 
  transform(array: any, propertyName: string): any {
   if(propertyName)
   return array.sort((a:any, b:any) => a[propertyName].localeCompare(b[propertyName]))
   else
    return array
  }
}
