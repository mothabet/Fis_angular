import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddCompanyMessage } from '../Dtos/CompanyMessageDto';

@Injectable({
  providedIn: 'root'
})
export class HomeCompanyMessagesService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddCompanyMessage(Model: IAddCompanyMessage){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`CompanyMessage/AddCompanyMessage?lang=2`, Model, { headers });
     return resopnse;
   }
   
   GetAllCompanyMessages(pageNumber:number , textSearch : string =''){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.get(environment.apiUrl+`CompanyMessage/GetAllCompanyMessages?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
      return resopnse;
    }
    DeleteCompanyMessage(id:number){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.delete(environment.apiUrl+`CompanyMessage/DeleteCompanyMessage?id=${id}&lang=2`, { headers });
      return resopnse;
    }
    UpdateCompanyMessage(id:number,Model: IAddCompanyMessage){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.put(environment.apiUrl+`CompanyMessage/UpdateCompanyMessage?id=${id}&lang=2`, Model, { headers });
      return resopnse;
    }
    GetCompanyMessageId(id:number){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.get(environment.apiUrl+`CompanyMessage/GetCompanyMessageId?id=${id}&lang=2`, { headers });
      return resopnse;
    }
}
