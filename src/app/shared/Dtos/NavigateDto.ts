
export interface IAddFormNotesDto {
    arName:string,
    enName:string,
}
export interface IAddListFormNotesDto {
    addFormNotesDtos : IAddFormNotesDto[],
    formId:string,
    companyId:string,
}
export interface IAddInstructionsDto {
    arName:string,
    enName:string,
}
export interface IAddListInstructionsDto {
    addInstructionsDtos : IAddInstructionsDto[],
    formId:string,
    companyId:string,
}