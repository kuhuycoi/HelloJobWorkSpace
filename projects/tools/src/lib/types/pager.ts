export class Pager {
    currentPage = 1;
    displayPerPage = 10;
    totalResult = 0;
    orderColumn = '';
    keyword = '';
    asc = true;
    totalPage = 0;
    constructor() {

    }
}
export class OrderContractPager extends Pager {
    place?: string;
    moduleId?: number;
    time?: number;
    examDateFrom?: any;
    examDateTo?: any;
    gender?: number;
    contractType?: any;
}
export class CustomerWishPager extends Pager {
    place?: string;
    moduleId?: number;
    salaryFrom?: number;
    salaryTo?: number;
    ageFrom?: number;
    ageTo?: number;
    gender?: string;
}
export class RecruitmentInfoPager extends Pager {
    orderID?: number;
    place?: string;
    status?: number;
}
export class SaleNewsTransactionPager extends Pager {
    isSaleForm?: boolean;
}

export class SaleNewsPager extends Pager {
    ageRangeValue?: any;
    gender?: string;
    heightRangeValue?: any;
    jobProvince?: any;
    moduleIDs?: any;
    salaryRange?: any;
    weightRangeValue?: any;
    filterType?: string;
}

export class AffiliatePager extends Pager {
    isCheck?: any
}
