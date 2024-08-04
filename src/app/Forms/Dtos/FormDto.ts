import { IGetTableDto } from "./TableDto"

export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : string,
    Type : string,
    yearDeleted:string,
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
    yearDeleted:string,
    typeQuarter:string
}
export interface ICoverFormDetailsDto{
    id:number,
    tables :IGetTableDto[],
    arName : string,
    arNotes : string,
    enNotes : string,
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
