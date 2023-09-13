import { Pipe, PipeTransform } from '@angular/core';
import { IRole } from '../interfaces/organisation.interfaces';
import { DateAgoPipe } from './date-ago.pipe';

@Pipe({ name: 'GetValue' })
export class GetValuePipe implements PipeTransform {
    transform(role: IRole, column: string): any {
        const pipe = new DateAgoPipe();
        const val: any = (role as any)[column];
        switch (typeof val) {
            case 'boolean': return (val ? String.fromCharCode(10003) : String.fromCharCode(10005) );
            case 'object':
                if (Object.prototype.toString.call(val) === '[object Date]') {
                    return pipe.transform(val);
                } else {
                    return val;
                }
            default: return val;
        }
    }
}
