import {AbstractControl, ValidatorFn} from '@angular/forms';

export function matchPassword(password: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any } => {
        const verified = control.value;
        return verified !== password ? {'verify': true} : null;
    };
 }