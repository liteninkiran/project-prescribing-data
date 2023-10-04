import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'FormatValue' })
export class FormatValuePipe implements PipeTransform {
    constructor(
        @Inject(LOCALE_ID) public locale: string
    ) { }

    transform(val: any): any {
        let newVal: any = val;
        const type = typeof val;
        switch (type) {
            case 'number':
                newVal = val === null ? null : (val === 0 ? '—' : formatNumber(val, this.locale, '1.0-0'));
                break;
            case 'boolean':
                newVal = (val ? String.fromCharCode(10003) : String.fromCharCode(10005) );
                break;
            case 'object':
                if (Object.prototype.toString.call(val) === '[object Date]') {
                    const pipe = new DateAgoPipe();
                    newVal = pipe.transform(val);
                }
                break;
            default:
                break;
        }
        return newVal;
    }
}
