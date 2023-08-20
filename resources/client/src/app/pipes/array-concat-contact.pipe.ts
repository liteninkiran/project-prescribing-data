import { Pipe, PipeTransform } from "@angular/core";
import { ISingleOrgContact } from "../interfaces/organisation.interfaces";

@Pipe({ name: 'ArrayConcatContact' })
export class ArrayConcatContactPipe implements PipeTransform {
    transform(contacts: ISingleOrgContact[]): any {
        const arr = contacts.map((contact: ISingleOrgContact) => {
            switch (contact.type) {
                case 'tel': contact.type = 'T'
            }
            return contact.value + ' (' + contact.type + ')';
        });
        return arr.join(', ');
    }
}
