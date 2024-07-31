export interface IAddForm {
    arName : string,
    enName : string,
    arNotes : string,
    enNotes : string,
    IsActive : boolean,
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
}