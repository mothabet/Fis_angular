export interface IWorkDataQuesDto {
  arName: string;
  enName: string;
  inputValue: string;
  isSelect:boolean
}
export interface IWorkDataChkDto {
  arName: string;
  enName: string;
  selected: boolean;
}

export interface IGeneralDataDto {
  CompanyInfo: IWorkDataQuesDto[],
  ChekInfo: number,
  dataSource: number,
  from: string,
  to: string,
  describeMainActivity: string,
  countryId : number,
}