
import { IGroupMember, IKeyValue } from "./keyvalue.type";
import { SNSAccountType } from "./sns.type";
export enum AccountEnum {
    JobSeeker = 0, Recruiter = 1, Collaborator = 2
}

export class ProfileType {
    public id: number;
    public type: AccountEnum = AccountEnum.JobSeeker;
    public fullName: string = '';
    public phoneNumber = null;
    public email?: string;
    public otp: any = null;
    public dateOfBirth: Date | null = null;
    public provinceID = null;
    public avatar = null;
    public gender = null;
    public height = null;
    public weight = null;
    public maritalStatus = null;
    public highSchoolID = null;
    public character: any[] = [];
    public jobExperience: any[] = [];
    public jobWant: any[] = [];

    constructor() {

    }
}