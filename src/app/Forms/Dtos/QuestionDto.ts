
export interface IAddQuestion {
  tableId: number;
  codeId: number;
}

export interface IGetQuestionDto {
  id: number;
  arName: string;
  enName: string;
  arNotes: string;
  enNotes: string;
  IsActive: boolean;
  Type: number;
}
