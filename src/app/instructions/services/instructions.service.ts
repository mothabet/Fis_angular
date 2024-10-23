import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddListInstructionsDto } from 'src/app/shared/Dtos/NavigateDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddInstructions(Model: IAddListInstructionsDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Instructions/AddInstructions?lang=2`, Model, { headers });
     return resopnse;
   }
   GetAllInstructions(role:string,formId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Instructions/GetAllInstructions?role=${role}&formId=${formId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   GetTableInstructions(role:string,formId:string,tableId:number,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Instructions/GetTableInstructions?role=${role}&formId=${formId}&tableId=${tableId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
}
