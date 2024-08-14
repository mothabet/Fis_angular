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
    debugger
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`Code/AddCode?lang=2`, Model, { headers });
    return resopnse;
  }
  GetAllCodesWithSubCodesPerant(pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Code/GetAllCodesWithSubCodesPerant?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   GetAllCodes(pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Code/GetAllCodes?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   DeleteCode(id:number,Department:string){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Code/DeleteCode?id=${id}&department=${Department}&lang=2`, { headers });
     return resopnse;
   }
   GetCodeById(id:number,Department:string){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Code/GetCodeById?id=${id}&department=${Department}&lang=2`, { headers });
     return resopnse;
   }
   UpdateCode(id:number,Model: IAddCode){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Code/UpdateCode?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
}
