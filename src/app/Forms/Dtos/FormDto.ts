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
    tables :IGetTablesDto[]
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
