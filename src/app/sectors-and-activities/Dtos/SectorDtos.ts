export interface IAddSectorDto{
    arName:string;
    enName:string;
    code:string;
}
export interface IAddActivityDto{
    arName:string;
    enName:string;
    code:string;
    sectorId:number;
}
export interface IAddSubActivityDto{
    arName:string;
    enName:string;
    code:string;
    activityId:number;
}
export interface IGetSectorDto{
    id:number;
    arName:string;
    enName:string;
    code:string;
    createdOn:string;
}