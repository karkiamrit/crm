import { LeadsStatus } from "../Leads";
export type Product = {
    name: string;
}

export type Service = {
    name: string;

}

export type LeadTimeline = {
    attribute: string;
    value: string;
    createdAt: Date;
}

export type LeadData = {
    id: number;
    address: string;
    details: string;
    status: LeadsStatus;
    phone: string;
    email: string;
    name: string;
    priority: number;
    createdAt: Date;
    source: string;
    timelines: LeadTimeline[];
    product: Product;
    service: Service;
    documents: string[];
    agentId: number;
}

