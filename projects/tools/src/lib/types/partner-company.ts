import { Users } from './users';

export class PartnerCompany {
    id?: number;
    username?: string;
    password?: string;
    name?: string;
    nameJapan?: string;
    address?: string;
    urlAvartar?: string;
    mobile?: string;
    code?: string;
    email?: string;
    content?: string;
    createdDate?: Date;
    isDeleted?: boolean;
    isActive?: boolean;
    description?: string;
    userID?: Users;
    originalFileName?: string;
    zaloContact?: string;
    websiteLink?: string;
    isCheck?: boolean;
    isVerify?: boolean;
}
