
export interface IAddFormNotesDto {
    arName:string,
    enName:string,
}
export interface IAddListFormNotesDto {
    addFormNotesDtos : IAddFormNotesDto[],
    formId:string,
    companyId:string,
}