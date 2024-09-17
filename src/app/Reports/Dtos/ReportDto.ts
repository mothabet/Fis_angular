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
    arTableName: string;         // Name of the table
    enTableName: string;               // Name of the table
    fields: ITableFieldDto[];           // List of fields in the table
}
export interface ITableFieldDto {
    dataType: string;
    name: string;  // Name of the field
    filter: number|null; // Filter applied to the field
    value: any;     // Value of the field, can be any type
}

export interface IFieldDto {
    dataType: string;
    name: string; 
}
export interface IReportFilterDto {
    id: number;
    arName: string; 
    enName: string; 
}

export interface IAddReportPartDto{
    part:string,
    query:string,
    withChart:boolean,
    chartType:number,
    reportId:number
}