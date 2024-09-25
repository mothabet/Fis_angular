export interface IWorkDataQuesDto {
  arName: string;
  enName: string;
  inputValue: string;
}
export interface IWorkDataChkDto {
  arName: string;
  enName: string;
  selected: boolean;
}

export interface IGeneralDataDto {
  CompanyInfo: IWorkDataQuesDto[],
  ChekInfo: IWorkDataChkDto[],
  dataSource: number,
  from: string,
  to: string,
  describeMainActivity: string
}