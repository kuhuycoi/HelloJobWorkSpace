import { FormControl } from "@angular/forms";

export class QuickPostFormControl extends FormControl {
    isShow = true;
    placeholder?: string;
    answers?: any;
    title?: string;
    hint?: string;
    questionType?: 'SELECT' | 'TEXT' | 'TEXTAREA' | 'RADIO' | 'CHECKBOX' | 'DATE' | 'NUMBER' = 'TEXT';
}
