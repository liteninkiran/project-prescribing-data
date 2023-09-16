import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayFilter' })
export class ArrayFilterPipe implements PipeTransform {
    transform(value: Array<any>, callback: any): any {
        console.log('Pipe');
        return value.filter(callback);
    }
}
