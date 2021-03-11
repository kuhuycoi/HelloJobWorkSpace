import { WebsiteLanguage } from './website-language';

export class Vocabulary {
    id?: number;
    content?: string;
    langCode?: WebsiteLanguage;
    parentID?: Vocabulary;
    isDeleted?: boolean;
    listParent?: Vocabulary[];
}
