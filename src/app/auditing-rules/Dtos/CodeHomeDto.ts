export interface IAddAuditRule {
    Rule:string,
    codeParent:number,
    Type:string
}
export interface IAuditRule{
    Id:number,
    Rule:string,
    Type:string,
    CreatedBy:string,
    CreatedOn:string,
    codeParent:string
}
