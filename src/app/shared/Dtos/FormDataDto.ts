
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
    TableArName:string|null,
    TableEnName:string|null,
}

export interface ICoverFormData {
    officialUse:string,
    activityCode:string
}