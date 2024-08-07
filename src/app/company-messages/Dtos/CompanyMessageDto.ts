import { Time } from "@angular/common"

export interface IAddCompanyMessage {
    companyid: number,
    messageid: number,
    date: Date,
    time: string,
}
export interface ICompanyMessage {
    id :number,
    companyid: number,
    messageid: number,
    date: Date,
    time: string,
}
