import { Pipe, PipeTransform } from '@angular/core';
import { IRole } from '../interfaces/organisation.interfaces';

@Pipe({ name: 'GetValue' })
export class GetValuePipe implements PipeTransform {
    transform(role: IRole, column: string): any {
        const val: any = (role as any)[column];
        return typeof val === 'boolean' ? (val ? String.fromCharCode(10003) : String.fromCharCode(10005) ) : val;
    }
}
