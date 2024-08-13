import { IAddSubCode, ISubCode } from "./SubCodeHomeDto"

export interface IAddCode {
    QuestionCode:string,
    arName: string,
    enName: string,
    TypeId: number|null,
    addSubCodeDtos : IAddSubCode[]
}
export interface ICode{
    Id:number,
    arName: string,
    enName: string,
    TypeId : number;
    QuestionCode:string
    Department : string | null
    SubCodes:ISubCode[]
}
