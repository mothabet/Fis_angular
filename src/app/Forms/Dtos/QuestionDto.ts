import { ICodeForm } from "src/app/code/Dtos/CodeHomeDto";

export interface IAddQuestion {
  tableId: number;
  codeId: number;
  IsActive:boolean;
}

export interface IGetQuestionDto {
  Id: number;
  tableId: number;
  codeId: number;
  values: number[];
  code:ICodeForm;
  valueCheck:boolean;
  isRule:boolean;
  IsHideSub:boolean,
  IsActive:boolean,
}
