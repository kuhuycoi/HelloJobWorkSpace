import { Users } from './users';
import { OrderContract } from './order-contract';
import { PartnerCompany } from './partner-company';

export class WebsiteOrderContract {
    id?: number;
    name?: string;
    nameAscii?: string;
    description?: string;
    content?: string;
    createdDate?: Date;
    isDeleted?: boolean;
    isShow?: boolean;
    lang?: string;
    orderDisplay?: number;
    seoDescription?: string;
    seoKeyword?: string;
    seoTitle?: string;
    isHome?: boolean;
    isHot?: boolean;
    urlAvatar?: string;
    viewed?: number;
    moduleIDs?: string;
    moduleTypeCode?: string;
    contentSource?: string;
    contractQuantity?: number;
    contractAddress?: string;
    contractSalary?: string;
    contractRequire?: string;
    contractWelfare?: string;
    contractTimeline?: string;
    contractPartnerInfo?: string;
    contractDate?: Date;
    orderContractID?: OrderContract;
    partnerCompanyID?: PartnerCompany;
    duration?: number;
    contractSalaryExact?: number;
    urlApply?: string;
    UserID?: Users;
    phonenumber?: string;
    code?:string
}
