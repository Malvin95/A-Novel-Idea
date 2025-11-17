import { status } from "./enums";

export interface Project {
    id?: string,
    name: string
}

export interface Claim {
    id?: string;
    companyName: string;
    claimPeriod: string;
    amount: number;
    associatedProject: string;
    status: status;
}