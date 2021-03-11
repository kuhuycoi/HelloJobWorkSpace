import { FormControl } from '@angular/forms';
import { VocabularyUsing } from './vocabulary-using';
import { VocabularyUsingType } from './vocabulary-using-type';

export class CustomFormControl extends FormControl {
  id?: number;
  placeholder?: string;
  usingType?: VocabularyUsingType;
  answers = [];
  required = false;
  question?: VocabularyUsing;
  suggestions?: any;
  filteredSuggestions?: any;
  indexkey?: string;
  isEditable?: boolean;
  hint?: string;
  parentIndexKey?: string;
  columns?: VocabularyUsing[];
  suffix?: string;
  prefix?: string;
}
