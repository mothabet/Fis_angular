import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddAuditRule } from '../Dtos/CodeHomeDto';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuditRuleHomeService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddAuditRules(Model: IAddAuditRule){
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`AuditRules/AddAuditRule`, Model, { headers });
    return resopnse;
  }
  GetAllAuditRules(pageNumber:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`AuditRules/GetAllAuditRules?pageNumber=${pageNumber}&lang=1`, { headers });
     return resopnse;
   }
   DeleteAuditRule(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`AuditRules/DeleteAuditRule?id=${id}`, { headers });
     return resopnse;
   }
}
