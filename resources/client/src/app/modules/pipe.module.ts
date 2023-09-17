import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrayConcatContactPipe } from '../pipes/array-concat-contact.pipe';
import { ArrayConcatPipe } from '../pipes/array-concat.pipe';
import { ArrayFilterPipe } from '../pipes/array-filter.pipe';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { FormatValuePipe } from '../pipes/format-value.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ArrayConcatPipe,
        ArrayConcatContactPipe,
        ArrayFilterPipe,
        FormatValuePipe,
        DateAgoPipe,
    ],
    exports: [
        ArrayConcatPipe,
        ArrayConcatContactPipe,
        ArrayFilterPipe,
        FormatValuePipe,
        DateAgoPipe,
    ],
})
export class PipeModule { }
