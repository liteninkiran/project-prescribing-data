import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'distance',
    pure: true,
})
export class DistancePipe implements PipeTransform {

    transform(value: any): any {
        if (value) {

            const intervals: any = {
                'metre'    : 1,
                'kilometer': 1000,
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(value / intervals[i]);
                if (counter > 0) {
                    return counter + ' ' + i + (counter > 1 ? 's' : '');
                }
            }
        }
        return value;
    }
}
