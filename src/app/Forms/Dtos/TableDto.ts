export interface IAddTableDto {
    arName: string,
    enName: string,
    arHeading: string,
    enHeading: string,
    Type: string,
    formId:number,
    IsActive: boolean,
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
}