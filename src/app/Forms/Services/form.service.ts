import { Injectable } from '@angular/core';
import { IAddForm } from '../Dtos/FormDto';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

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
}
