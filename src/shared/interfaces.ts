import { status } from "./enums";

export interface Project {
    id?: string,
    dateCreated: string,
    projectName: string,
}

export interface Claim {
    id?: string;
    dateCreated?: string;
    companyName: string;
    claimPeriod: string;
    amount: number;
    associatedProject: string;
    status: status;
}
