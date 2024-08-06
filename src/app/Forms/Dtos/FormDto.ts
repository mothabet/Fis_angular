import { IGetTableDto } from "./TableDto"

export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : string,
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
}
export interface IGetTablesDto {
    id:number,
    arName : string,
    enName : string,
    enHeading : string,
    arHeading : string,
    IsActive : boolean,
    formId : number
}