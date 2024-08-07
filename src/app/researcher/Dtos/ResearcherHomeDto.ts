import { ICompany } from "src/app/companies/Dtos/CompanyHomeDto"

export interface IAddResearcher {
    userName: string,
    password: string,
    arName: string,
    enName: string,
    status: string,
    phone: string,
    email: string,
}
export interface IResearcher {
    id:number,
    arName: string,
    enName: string,
    userName: string,
    status: boolean,
    email: string,
    phone: number,
    UserId: number
    companies : ICompany[]
}
