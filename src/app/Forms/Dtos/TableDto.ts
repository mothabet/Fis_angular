import { IGetQuestionDto } from "./QuestionDto";
import { IAddTablePartsDto } from "./TablePartsDto";

export interface IAddTableDto {
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    Type: string,
    formId:number,
    IsActive: boolean,
    period: number,
    tableParts : IAddTablePartsDto[]
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