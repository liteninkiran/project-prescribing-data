import { Pipe, PipeTransform } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';

@Pipe({ name: 'FormatValue' })
export class FormatValuePipe implements PipeTransform {
    transform(val: any): any {
        const pipe = new DateAgoPipe();
        let newVal: any = val;
        const type = typeof val;
        switch (type) {
            case 'boolean':
                newVal = (val ? String.fromCharCode(10003) : String.fromCharCode(10005) );
                break;
            case 'object':
                if (Object.prototype.toString.call(val) === '[object Date]') {
                    newVal = pipe.transform(val);
                }
                break;
            default:
                break;
        }
        return newVal;
    }
}
