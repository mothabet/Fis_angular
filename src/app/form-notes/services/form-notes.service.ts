import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddFormNotesDto, IAddListFormNotesDto } from 'src/app/shared/Dtos/NavigateDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FormNotesService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddFormNotes(Model: IAddListFormNotesDto){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`FormNotes/AddFormNotes?lang=2`, Model, { headers });
     return resopnse;
   }
   GetAllFormNotesByRole(role:string,formId:string,companyId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`FormNotes/GetAllFormNotesByRole?role=${role}&formId=${formId}&companyId=${companyId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
}
