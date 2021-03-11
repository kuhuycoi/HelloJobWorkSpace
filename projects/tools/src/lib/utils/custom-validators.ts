import { AbstractControl } from '@angular/forms';

// tslint:disable-next-line: max-line-length
const EMAIL_REGEXP = /^((([^#<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}));{0,1})+$/;
const PHONE_REGEXP = /^\+[\d]{6,}|0[\d]{9,10}$/;

export function customEmailValidator(control: AbstractControl) {
    return customPatternValidator(control, EMAIL_REGEXP);
}
export function customPhoneValidator(control: AbstractControl) {
    return customPatternValidator(control, PHONE_REGEXP);
}
function customPatternValidator(control: AbstractControl, pattern: RegExp) {
    return !control.value || pattern.test(control.value) ? null : {
        validateEmail: {
            valid: false
        }
    };
}
