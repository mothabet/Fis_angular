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
    debugger
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`AuditRules/AddAuditRule`, Model, { headers });
    return resopnse;
  }
}
