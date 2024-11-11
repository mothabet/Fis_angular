export interface IAddCompanyMessage {
    companyid: number,
    messageid: number,
    // date: Date,
    // time: string,
}
export interface ICompanyMessage {
    id :number,
    companyid: number,
    messageid: number,
    // date: string,
    // time: string,
    arDetails: string,
    enDetails: string,
    arName: string,
    enName: string,
    CreatedOn: Date
}
