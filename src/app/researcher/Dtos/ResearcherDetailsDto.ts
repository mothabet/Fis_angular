
export interface IAddResearcherMandateDto {
    researcherMandateId:string,
    fromDate:string,
    toDate:string,
    researcherId:string,
    IsCancelled : boolean,
}
export interface IGetResearcherMandateDto {
    id:number,
    researcherMandateId:string,
    fromDate:string,
    toDate:string,
    researcherId:string,
    arName:string
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