import { IGroupMember } from "./keyvalue.type";

export interface IRules{
    has_multi_groups?: boolean;
    groups?: IGroupMember[];
    quota: {
        min: number,
        max: number
    },
}

export interface ICommonCategory{
    rules: IRules;
    items: IGroupMember[];
}

export interface IPhoneCodeEntity{
    key: string;
    country: string;
    phone_code: string;
    default?: boolean;
    rules: {
        minLength: number;
        maxLength: number;
    }
}

export interface IGenderEntity extends IGroupMember {};
export interface IGenderCategory {
    rules: IRules,
    items: IGenderEntity[]
}

export interface IExperienceEntity extends IGroupMember {
    year?: number;
};
export interface IExperienceCategory {
    rules: IRules,
    items: IExperienceEntity[]
}

export interface ISchoolEntity extends IGroupMember{
    city?: string;
    majors?: IGroupMember[];
}
export interface IShoolCategory {
    rules: IRules,
    items: ISchoolEntity[];
}


export interface IRangeValueEntity{
    unit: string;
    min: number;
    max: number;
    interval: number;
    default: number;
    before_min_label: string;
    after_max_label: string;
}
