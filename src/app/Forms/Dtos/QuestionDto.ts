import { ICode } from "src/app/code/Dtos/CodeHomeDto";

export interface IAddQuestion {
  tableId: number;
  codeId: number;
}

export interface IGetQuestionDto {
  Id: number;
  tableId: number;
  codeId: number;
  values: number[];
  code:ICode;
}
