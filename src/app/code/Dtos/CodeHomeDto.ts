import { IAddSubCode, ISubCode, ISubCodeForm } from "./SubCodeHomeDto"

export interface IAddCode {
    QuestionCode:string,
    arName: string,
    enName: string,
    TypeId: number|null,
    addSubCodeDtos : IAddSubCode[],
    id_Level :string
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

export interface ICodeForm{
    Id:number,
    arName: string,
    enName: string,
    TypeId : number;
    QuestionCode:string
    Department : string | null,
    connectedWithId:number|null,
    connectedWithLevel:number|null,
    SubCodes:ISubCodeForm[],

}
export interface IGetAllCodesAndSubCodesAndSubSubCodes{
    id:number,
    arName: string,
    enName: string,
    Level:number,
    Code:string
}