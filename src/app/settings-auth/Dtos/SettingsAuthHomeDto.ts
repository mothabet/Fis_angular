export interface IAddSettingsAuth {
    userName: string,
    password: string,
    arName: string,
    enName: string,
    status: string,
    phone: string,
    email: string,
}
export interface IAddPermissionDto{
    arName:string,
    enName:string,
    isName:boolean,
    add:boolean,
    edit:boolean,
    delete:boolean,
    download:boolean
}
export interface IGetSettingsAuthDto {
    id:number,
    userName: string,
    password: string,
    arName: string,
    enName: string,
    status: string,
    phone: string,
    email: string,
    UserId:number
    permissions:IGetPermissionDto[]
}
export interface IGetPermissionDto{
id:number,
    arName:string,
    enName:string,
    isName:boolean,
    add:boolean,
    edit:boolean,
    delete:boolean,
    download:boolean,
    settingsAuthId:number
}
export interface IAddSettingsAuthAndPermissionDto{
    addSettingsAuthDto:IAddSettingsAuth,
    addPermissionDto : IAddPermissionDto[],
}