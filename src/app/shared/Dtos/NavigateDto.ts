export interface IAddFormNotesDto {
    arName:string,
    enName:string,
    isRead:boolean
}
export interface IGetFormNotesDto {
    id:number,
    arName:string,
    enName:string,
    isRead:boolean
}
export interface IAddListFormNotesDto {
    addFormNotesDtos : IAddFormNotesDto[],
    formId:string,
    companyId:string,
}
export interface IUpdateFormNoteDto {
    formId:string,
    companyId:string,
    role:string
}
export interface IAddInstructionsDto {
    id:number,
    arName:string,
    enName:string,
    tableId:string,
}
export interface IAddListInstructionsDto {
    addInstructionsDtos : IAddInstructionsDto[],
    formId:string,
}