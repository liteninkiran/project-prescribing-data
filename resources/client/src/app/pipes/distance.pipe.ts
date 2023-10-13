import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
    name: 'distance',
    pure: true,
})
export class DistancePipe implements PipeTransform {
    constructor(
        @Inject(LOCALE_ID) public locale: string
    ) { }

    public transform(value: number): string {
        let newValue = value;
        let units = 'metre';
        if (value > 1000) {
            newValue = value / 1000;
            units = 'kilo' + units;
        }

        let format = '1.0-0';

        switch(true) {
            case newValue <    1: format = '1.4-4'; break;
            case newValue <   10: format = '1.3-3'; break;
            case newValue <  100: format = '1.2-2'; break;
            case newValue < 1000: format = '1.1-1'; break;
        }
        
        return formatNumber(newValue, this.locale, format) + ' ' + units + (newValue > 1 ? 's' : '');
    }
}
