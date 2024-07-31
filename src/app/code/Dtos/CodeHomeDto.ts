import { IAddSubCode } from "./SubCodeHomeDto"

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
    QuestionCode:string
}
