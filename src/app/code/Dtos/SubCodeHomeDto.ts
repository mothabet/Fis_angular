export interface IAddSubCode {
    Id:number;
    QuestionCode:string,
    arName: string,
    enName: string,
}
export interface ISubCode{
    Id:number,
    arName: string,
    enName: string,
    QuestionCode:string,
    codeId :number
    // subCodes:ISubCode[]
}
