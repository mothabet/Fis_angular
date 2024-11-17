export interface IGetReportDto {
    id: number,
    arName: string,
    enName: string,
    status: boolean,
    createdOn: string,
}
export interface IAddReportDto {
    arName: string,
    enName: string,
    status: boolean,
}
export interface ITableDto {
    selectAllFields: boolean;
    arTableName: string;         // Name of the table
    enTableName: string;               // Name of the table
    fields: ITableFieldDto[];           // List of fields in the table
}
export interface ITableFieldDto {
    dataType: string | null;
    name: string;  // Name of the field
    arName: string;  // Name of the field
    filter: number | null; // Filter applied to the field
    value: any;     // Value of the field, can be any type
}

export interface IFieldDto {
    dataType: string;
    name: string;
    arName: string;
}
export interface IReportFilterDto {
    id: number;
    arName: string;
    enName: string;
}

export interface IAddReportPartDto {
    part: string,
    query: string,
    withChart: boolean,
    reportType: string,
    seconedTable: string,
    reportDetails: string,
    chartType: number,
    reportId: number
}
interface YearData {
    reviewYear: number;
    totalCode: number;
  }
  

export interface ReportField {
    questionCode: string;
    codeArName: string;
    codeEnName: string;
    years: YearData[];
}
export interface ReportActivityField {
    questionCode: string;
    codeArName: string;
    codeEnName: string;
    activityCode: string;
    activityArName: string;
    years: YearData[];
}

export interface IGetReportPartsDto {
    id: number,
    part: string,
    withChart: boolean,
    chartType: number,
    fields: IFieldsDetailsDto[]
}
export interface IFieldsDetailsDto {
    key: number,
    value: string
}