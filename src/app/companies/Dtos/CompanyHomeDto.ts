export interface ICompany {
    activityId: number,
    arActivityName: string,
    enActivityName: string,
    address: string,
    arName: string,
    enName: string,
    compRegNumber: string,
    municipalityNumber: string,
    fax: string,
    activity: string,
    subActivity: string,
    governorates: string,
    governoratesId: number,
    sectorId: number,
    mailBox: string,
    wilayatId: number,
    wilayat: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    status: string,
    id: number,
    researcherId:string
    accountingPeriod: number,
    legalType: string,
}
export interface ICompaniesPDF {
    activityId: number,
    arActivityName: string,
    address: string,
    arName: string,
    compRegNumber: string,
    id: number,
}

export interface IAddCompany {
    userName: string,
    password: string,
    arName: string,
    enName: string,
    municipalityNumber: string,
    compRegNumber: string,
    accountingPeriod: string,
    completionAccPeriod: string,
    phoneNumber: string,
    telNumber: string,
    fax: string,
    webSite: string,
    address: string,
    mailBox: string,
    postalCode: string,
    dateOfWork: string,
    institutionHeadquarters: string,
    institutionVlaue: string,
    legalType: string,
    sectorId: number,
    activityId: number,
    subActivityId: number,
    governoratesId: number,
    wilayatId: number,
    companyEmails: ICompanyEmail[];
}
export interface ICompanyEmail {
    Email: string,
}

export interface IPdfDto{
    arName : string,
    enName : string,
    companyId : number
}