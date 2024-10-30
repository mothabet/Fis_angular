import { IAddPermissionDto, IGetPermissionDto } from "src/app/permissions/Dtos/PermissionDto"

export interface IAddSettingsAuth {
    userName: string,
    password: string,
    arName: string,
    enName: string,
    status: string,
    phone: string,
    email: string,
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
export interface IAddSettingsAuthAndPermissionDto{
    addSettingsAuthDto:IAddSettingsAuth,
    addPermissionDto : IAddPermissionDto[],
}