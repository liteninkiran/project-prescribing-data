import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'ArrayConcat' })
export class ArrayConcatPipe implements PipeTransform {
    transform(input: any[], key: string): any {
        return input ? input.map((item: any) => item[key]).join(', ') : '';
    }
}
