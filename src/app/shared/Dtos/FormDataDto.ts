
export interface IAddFormDataDto {
    dataDtos:IDataDto[],
    FormId:number,
    coverData:string,
    certificationData:string,
    GeneralData:string
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
    connectedWithType:string,
    TableArName:string|null,
    TableEnName:string|null,
    arName:string|null,
    enName:string|null,
}

export interface ICoverFormData {
    activityCode:string
}