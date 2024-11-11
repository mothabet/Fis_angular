import { Injectable } from '@angular/core';
import { IAddForm, SendCompanyFormsDto } from '../Dtos/FormDto';
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
    var response = this.http.post(environment.apiUrl + `Form/AddForm?lang=2`, Model, { headers });
    return response;
  }
  GetAllForms(yearSelect:string,typeSelect:string){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Form/GetAllForms?lang=2&yearSelect=${yearSelect}&typeSelect=${typeSelect}`,{ headers });
     return resopnse;
   }
   GetFormData(formId:number , companyId:number = 0,tableId=0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`FormData/GetAllFormData?lang=2&formId=${formId}&companyId=${companyId}&tableId=${tableId}`,{ headers });
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
   GetFormById(id:number,type:string = '',companyId:number = 0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Form/GetFormById?id=${id}&lang=2&type=${type}&companyId=${companyId}`, { headers });
     return resopnse;
   }
   UpdateForm(id:number,Model: IAddForm){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/UpdateForm?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
   CopyForm(formId:string){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Form/CopyForm?formId=${formId}&lang=2`,'', { headers });
     return resopnse;
   }
   DeleteTable(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Table/DeleteTable?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   AddFormContent(Model: IAddQuestion){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`FormContent/AddFormContent?lang=2`, Model, { headers });
     return resopnse;
   }
   DeleteFormContent(id:number){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`FormContent/DeleteFormContent?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetFormContentById(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`FormContent/GetFormContentById?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetCompanyForms(id:number , pageType:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Form/GetCompanyForms?companyId=${id}&lang=2&pageType=${pageType}`, { headers });
     return resopnse;
   }
   UpdateFormContent(id:number,Model: IAddQuestion){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`FormContent/UpdateFormContent?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
   sendForm(formDto: SendCompanyFormsDto) {
    
    const headers = this.sharedService.getHeaders();
    const response = this.http.post(environment.apiUrl+`Form/SendForm`, formDto, { headers });
    return response;
  }
  CompleteForm(formId: number , companyId : number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/CompleteForm?formId=${formId}&companyId=${companyId}`, { headers });
     return resopnse;
   }
   CloseForm(formId: number , companyId : number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/CloseForm?formId=${formId}&companyId=${companyId}`, { headers });
     return resopnse;
   }
   OpenForm(formId: number , companyId : number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/OpenForm?formId=${formId}&companyId=${companyId}`, { headers });
     return resopnse;
   }
   BeginningForm(formId: number , companyId : number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Form/BeginningForm?formId=${formId}&companyId=${companyId}`, { headers });
     return resopnse;
   }
   DeleteCompanyForm(formId:number,companyId:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Form/DeleteCompanyForm?formId=${formId}&companyId=${companyId}&lang=2`, { headers });
     return resopnse;
   }
   GetTables(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Table/GetTables?lang=2`, { headers });
     return resopnse;
   }
}
