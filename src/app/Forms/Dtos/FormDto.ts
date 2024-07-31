import { IGetTableDto } from "./TableDto"

export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : string,
    Type : string
}

export interface IGetFormDto {
    id:number,
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : boolean,
    Type : number
    tables :IGetTableDto[]
}
export interface ICoverFormDetailsDto{
    id:number,
    tables :IGetTableDto[]
}
