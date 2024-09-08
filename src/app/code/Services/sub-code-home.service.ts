import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddSubCode } from '../Dtos/SubCodeHomeDto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubCodeHomeService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddSubCode(Model: IAddSubCode[]){
    
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`SubCodes/AddSubCode?lang=2`, Model, { headers });
    return resopnse;
  }
  GetSubCodesByCodeId(id:number){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`SubCodes/GetSubCodesByCodeId?id=${id}&lang=2`, { headers });
     return resopnse;
  }
  GetSubCodesById(id:number){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`SubCodes/GetSubCodesById?id=${id}&lang=2`, { headers });
     return resopnse;
  }
  GetAllSubCodes(pageNumber:number, textSearch : string ='',questionCode:string=""){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`SubCodes/GetAllSubCodes?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&questionCode=${questionCode}&withNull=false`, { headers });
     return resopnse;
   }
}
