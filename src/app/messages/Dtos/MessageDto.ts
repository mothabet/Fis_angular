
export interface IAddMessage {
    arDetails: string,
    enDetails: string,
    arSubject: string,
    enSubject: string,
    arName: string,
    enName: string,
    typeMessage:number
}
export interface IMessage {
    Id :number,
    arSubject: string,
    enSubject: string,
    arDetails: string,
    enDetails: string,
    arName: string,
    enName: string,
    typeMessage:number,
    CreatedOn:string
}
