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
export interface IAddSettingsAuthAndPermissionDto{
    addSettingsAuthDto:IAddSettingsAuth,
    addPermissionDto : IAddPermissionDto[],
}