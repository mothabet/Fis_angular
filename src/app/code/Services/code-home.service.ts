import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddCode } from '../Dtos/CodeHomeDto';

@Injectable({
  providedIn: 'root'
})
export class CodeHomeService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddCode(Model: IAddCode){
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`Code/AddCode`, Model, { headers });
    return resopnse;
  }
  GetAllCodes(pageNumber:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Code/GetAllCodes?pageNumber=${pageNumber}&lang=1`, { headers });
     return resopnse;
   }
   DeleteCode(id:number){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Code/DeleteCode?id=${id}`, { headers });
     return resopnse;
   }
   GetCodeById(id:number){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Code/GetCodeById?id=${id}`, { headers });
     return resopnse;
   }
   UpdateCode(id:number,Model: IAddCode){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Code/UpdateCode?id=${id}`, Model, { headers });
     return resopnse;
   }
}
