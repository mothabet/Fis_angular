import { IGetQuestionDto } from "./QuestionDto";
import { IAddTablePartsDto } from "./TablePartsDto";

export interface IAddTableDto {
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    arNotes:string,
    enNotes:string,
    Type: string,
    Order: string,
    formId:number,
    IsActive: boolean,
    IsTotal:boolean,
    period: number,
    tableParts : IAddTablePartsDto[]
}
export interface IGetTableDto {
    id:number,
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    arNotes:string,
    enNotes:string,
    Type: string,
    Order: string,
    formId:number,
    period:number,
    IsActive: boolean,
    IsTotal:boolean,
    IsDisabled:boolean,
    formContents :IGetQuestionDto[]
    tableParts :IGetTableParts[]
}

export interface IGetTableParts{
    arName: string,
    enName: string
}

export interface IGetTableRep{
    Id:number,
    arName: string,
    enName: string,
}