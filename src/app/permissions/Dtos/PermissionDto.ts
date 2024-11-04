
export interface IAddPermissionDto {
    arName: string,
    enName: string,
    isName: boolean,
    add: boolean,
    edit: boolean,
    delete: boolean,
    connectWithCompany: boolean,
    addCompaniesGroup: boolean,
    copy: boolean,
    download: boolean
}
export interface IGetPermissionDto {
    id: number,
    arName: string,
    enName: string,
    isName: boolean,
    add: boolean,
    edit: boolean,
    delete: boolean,
    connectWithCompany: boolean,
    addCompaniesGroup: boolean,
    copy: boolean,
    download: boolean,
    settingsAuthId: number
}