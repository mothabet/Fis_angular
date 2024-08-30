
export interface IAddFormDataDto {
    dataDtos:IDataDto[],
    FormId:number,
    coverData:string
}
export interface IDataDto{
    TableId:number,
    questionId:string|number,
    codes : number[]
    level : number,
    codeId : number,
    codeType:number,
    valueCheck:boolean,
    parentCodeId:number,
    connectedWithId:number|null,
    connectedWithLevel:number|null,
    TableArName:string|null,
    TableEnName:string|null,
}