import { Injectable } from '@angular/core';
import { IAddForm } from '../Dtos/FormDto';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddTableDto } from '../Dtos/TableDto';
import { IAddQuestion } from '../Dtos/QuestionDto';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  addForm(Model: IAddForm) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.post(environment.apiUrl + `Form/AddForm`, Model, { headers });
    return response;
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
   AddTable(Model: IAddTableDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Table/AddTable?lang=2`, Model, { headers });
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
   DeleteTable(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Table/DeleteTable?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   AddFormContent(Model: IAddQuestion){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`FormContent/AddFormContent?lang=2`, Model, { headers });
     return resopnse;
   }
}
