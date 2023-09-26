import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: true,
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            // less than 30 seconds ago will show as 'Just now'
            if (seconds < 30) {
                return 'Just now';
            }
            const intervals: any = {
                'year'  : 31536000,
                'month' : 2592000,
                'week'  : 604800,
                'day'   : 86400,
                'hour'  : 3600,
                'minute': 60,
                'second': 1,
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0) {
                    return counter + ' ' + i + (counter > 1 ? 's' : '') + ' ago';
                }
            }
        }
        return value;
    }
}
