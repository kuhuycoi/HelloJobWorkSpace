import { PartnerCompany } from './partner-company';
import { Customer } from './customer';
import { WebsiteOrderContract } from './website-order-contract';
export class SaleNews {
    id?: string;
    content?: string;
    partnerCompanyID?: PartnerCompany;
    saleType?: string;
    contentType?: string;
    refID?: number;
    refIDObject?: any;
    price?: number;
    moneyAfterFly?: number;
    moneyBackOrigin?: number;
}
