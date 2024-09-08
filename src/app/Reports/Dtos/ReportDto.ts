export interface IAddReportDto {
    arName: string,
    enName: string,
    status: boolean,
}
export interface IGetReportDto {
    id: number,
    arName: string,
    enName: string,
    status: boolean,
    createdOn: string,
}