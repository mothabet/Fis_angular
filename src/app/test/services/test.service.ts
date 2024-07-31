import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddForm } from 'src/app/Forms/Dtos/FormDto';
import { IAddTableDto } from 'src/app/Forms/Dtos/TableDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddForm(Model: IAddForm){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Form/AddForm?lang=2`, Model, { headers });
     return resopnse;
   }
   GetAllForms(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Form/GetAllForms?lang=2`,{ headers });
     return resopnse;
   }
   DeleteForm(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Form/DeleteForm?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetFormById(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Form/GetFormById?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   UpdateForm(id:number,Model: IAddForm){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/UpdateForm?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
   AddTable(Model: IAddTableDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Table/AddTable?lang=2`, Model, { headers });
     return resopnse;
   }
   GetAllTables(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Table/GetAllTables?lang=2`,{ headers });
     return resopnse;
   }
   DeleteTable(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Table/DeleteTable?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetTableById(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Table/GetTableById?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   UpdateTable(id:number,Model: IAddTableDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Table/UpdateTable?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
}
