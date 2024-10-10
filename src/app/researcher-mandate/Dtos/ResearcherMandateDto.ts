import { ICompany } from "src/app/companies/Dtos/CompanyHomeDto"

export interface IAddResearcherMandateDto {
    researcherMandateId:string,
    researcherId:string,
    selectedCompanies:number[]
}
export interface IGetResearcherMandateDto {
    id:number,
    researcherMandateId:string,
    fromDate:string,
    toDate:string,
    researcherId:string,
    arName:string
    IsCancelled : boolean,
    CancelledOn:string,
    CreatedOn:string
}
export interface IAddListResearcherMandateDto {
    addResearcherMandateDtos : IAddResearcherMandateDto[],
    researcherId:string,
}
export interface IAdminDataDto {
    adminName : string,
    adminEmail:string,
    adminPhone:string,
}