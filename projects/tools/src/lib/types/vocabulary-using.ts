import { Vocabulary } from './vocabulary';
import { WebsiteLanguage } from './website-language';
import { VocabularyUsingType } from './vocabulary-using-type';

export class VocabularyUsing {
  id?: number;
  vocabularyID?: Vocabulary;
  indexKey?: string;
  regardObjectID?: any;
  langCode?: WebsiteLanguage;
  vocabularyUsingTypeID?: VocabularyUsingType;
  answers?: string;
  defaultRow?: string;
  isSuggestion?: boolean;
  isRequired?: boolean;
  isBasicInfo?: boolean;
  isTranslateInfo?: boolean;
  isEditable?: boolean;
  groupKey?: string;
  orderNumber?: number;
  hint?: string;
  suffix?: string;
  prefix?: string;
  parentIndexKey?: string;
}
