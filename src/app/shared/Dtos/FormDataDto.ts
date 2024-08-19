
export interface IAddFormDataDto {
    dataDtos:IDataDto[],
    FormId:number
}
export interface IDataDto{
    TableId:number,
    questionId:string|number,
    codes : number[]
    level : number
}