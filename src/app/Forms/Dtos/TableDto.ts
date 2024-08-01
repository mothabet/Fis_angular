import { IGetQuestionDto } from "./QuestionDto";

export interface IAddTableDto {
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    Type: string,
    formId:number,
    IsActive: boolean,
    period: number,
}
export interface IGetTableDto {
    id:number,
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    Type: string,
    formId:number,
    IsActive: boolean,
    formContents :IGetQuestionDto[]
}