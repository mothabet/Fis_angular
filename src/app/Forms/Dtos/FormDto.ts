import { IGetTableDto } from "./TableDto"

export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : boolean,
    IsTotal:boolean,
    Type : string,
    reviewYear:number,
    typeQuarter:string
}

export interface IGetFormDto {
    id:number,
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : boolean,
    IsTotal:boolean,
    Type : number,
    tables :IGetTableDto[],
    reviewYear:string,
    typeQuarter:string
}
export interface ICoverFormDetailsDto{
    id:number,
    typeQuarter:number,
    tables :IGetTableDto[],
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    reviewYear : string,
    status:number,
    quarterCoverData : IQuarterCoverFormDataDto
}
export interface IGetTablesDto {
    id:number,
    arName : string,
    enName : string,
    enHeading : string,
    arHeading : string,
    IsActive : boolean,
    IsTotal:boolean,
    formId : number
}

export interface IGetCountriesDto {
    id:number,
    arName : string,
    enName : string,
}

export interface IGetActivitiesDto {
    id:number,
    arName : string,
    enName : string,
}
export interface SendCompanyFormsDto {
    companiesIds: number[];
    formId: number;
    messageId: number;
    emailTitle: string;
    emailBody: string;
  }
  export interface IQuarterCoverFormDataDto {
    establishmentName: string;
    postalAddress: string;
    telephoneNumber: string;
    faxNumber: string;
    emailAddress:string;
    geographicalDistribution:string;
  }