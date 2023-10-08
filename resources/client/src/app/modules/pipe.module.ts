import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrayConcatPipe } from '../pipes/array-concat.pipe';
import { ArrayFilterPipe } from '../pipes/array-filter.pipe';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { FormatValuePipe } from '../pipes/format-value.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

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
    ],
    exports: [
        ArrayConcatPipe,
        ArrayFilterPipe,
        FormatValuePipe,
        DateAgoPipe,
        SafeHtmlPipe,
    ],
})
export class PipeModule { }
