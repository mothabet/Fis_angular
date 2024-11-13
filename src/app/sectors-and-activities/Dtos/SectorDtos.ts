export interface IAddSectorDto{
    arName:string;
    enName:string;
    code:string;
}
export interface IAddCountryDto{
    arName:string;
    enName:string;
    code:string;
    countryPhone:string;
}
export interface IAddActivityDto{
    arName:string;
    enName:string;
    code:string;
    sectorId:number;
    categoryId:number;
}
export interface IAddGovernorateDto{
    arName:string;
    enName:string;
}
export interface IAddWilayatDto{
    arName:string;
    enName:string;
    embeded:string;
    GovernoratesId:number
}
export interface IAddCategory{
    arName:string;
    enName:string;
    code:string;
    groupId:number;
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
    activityId:number;
    sectorId:number;
    categoryId:number;
}
export interface IGetCountryDto{
    id:number;
    arName:string;
    enName:string;
    code:string;
    createdOn:string;
    countryPhone:string;
}
export interface IGetGovernorateDto{
    id:number;
    arName:string;
    enName:string;
}
export interface IGetWilayatDto{
    id:number;
    arName:string;
    enName:string;
    embeded:string;
    GovernoratesId:number
    Governorates:IGetGovernorateDto
}

export interface IAddGroupDto{
    arName:string;
    enName:string;
    code:string;
    sectionId:number;
}
export interface IGetGroupDto{
    id:number;
    arName:string;
    enName:string;
    code:string;
    createdOn:string;
    activityId:number;
    sectionId:number;
}