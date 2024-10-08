import { ICoverFormData } from "src/app/shared/Dtos/FormDataDto"
import { IGetTableDto } from "./TableDto"
import { IGeneralDataDto } from "./WorkDataDto"

export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : boolean,
    IsTotal:boolean,
    Type : string,
    reviewYear:number,
    typeQuarter:string,
    codeActivity:string
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
    quarterCoverData : IQuarterCoverFormDataDto,
    coverFormData : ICoverFormData,
    certification : ICertificationDto,
    codeActivity:string,
    codeActivityName:string,
    GeneralData : IGeneralDataDto
    Type : number,

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
    code:string
}

export interface IGetActivitiesDto {
    id:number,
    arName : string,
    enName : string,
    code:string
}
export interface SendCompanyFormsDto {
    companiesIds: number[];
    formId: number;
    messageId: number;
    emailTitle: string;
    emailBody: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
  }
  export interface IQuarterCoverFormDataDto {
    establishmentName: string;
    postalAddress: string;
    telephoneNumber: string;
    faxNumber: string;
    emailAddress:string;
    geographicalDistribution:string;
  }

  export interface ICertificationDto{
    companiesDetails:string;
    completedBy:string;
    telephoneNo:string;
    dateOfCompletion:string;
}