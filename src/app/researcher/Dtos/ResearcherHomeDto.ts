export interface IAddResearcher {
    userName: string,
    password: string,
    fullName: string,
    enfullName: string,
    status: string,
    phone: string,
    email: string,
}
export interface IResearcher {
    id:number,
    fullName: string,
    enfullName: string,
    userName: string,
    status: boolean,
    email: string,
    phone: number,
    UserId: number
}
