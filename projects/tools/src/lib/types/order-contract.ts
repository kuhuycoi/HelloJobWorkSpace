import { PartnerCompany } from './partner-company';

export class OrderContract {
    id?: number;
    contractName?: string;
    contractAddress?: string;
    contractQuantity?: number;
    contractSalary?: number;
    contractDate?: Date;
    isDeleted?: boolean;
    isActive?: boolean;
    partnerCompanyID?: PartnerCompany;
    examDate?: Date;
    descriptionURL?: string;
    typeURL?: boolean;
    totalNeedPay?: number;
    predictCompleteDocumentDate?: Date;
    totalNeedPayMale?: number;
    totalNeedPayFeMale?: number;
    moneyTarget?: number;
}
