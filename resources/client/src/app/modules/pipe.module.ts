import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrayConcatPipe } from '../pipes/array-concat.pipe';
import { ArrayFilterPipe } from '../pipes/array-filter.pipe';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { FormatValuePipe } from '../pipes/format-value.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { DistancePipe } from '../pipes/distance.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ArrayConcatPipe,
        ArrayFilterPipe,
        FormatValuePipe,
        DateAgoPipe,
        SafeHtmlPipe,
        DistancePipe,
    ],
    exports: [
        ArrayConcatPipe,
        ArrayFilterPipe,
        FormatValuePipe,
        DateAgoPipe,
        SafeHtmlPipe,
        DistancePipe,
    ],
})
export class PipeModule { }
