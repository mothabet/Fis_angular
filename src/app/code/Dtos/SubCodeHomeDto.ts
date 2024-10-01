export interface IAddSubCode {
    Id:number;
    QuestionCode:string,
    arName: string,
    enName: string,
    id_Level: string,
    connectedWithType:string,
    IsTrueAndFalse:boolean
}
export interface ISubCode{
    Id:number,
    arName: string,
    enName: string,
    QuestionCode:string,
    codeId :number
    subCodes:ISubCode[]
}
export interface ISubCodeForm{
    Id:number,
    arName: string,
    enName: string,
    QuestionCode:string,
    codeId :number
    subCodes:ISubCode[]
    values: number[];
    connectedWithId:number|null,
    connectedWithLevel:number|null,
    connectedWithType:string,
    IsTrueAndFalse:boolean,
  valueCheck:boolean;

}
