import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddResearcherMandateDto, IGetResearcherMandateDto } from '../Dtos/ResearcherMandateDto';

@Injectable({
  providedIn: 'root'
})
export class ResearcherMandateService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddResearcherMandate(Model: IAddResearcherMandateDto){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`ResearcherMandate/AddResearcherMandate?lang=2`, Model, { headers });
     return resopnse;
   }
   GetAllResearcherMandate(researcherId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`ResearcherMandate/GetAllResearcherMandate?researcherId=${researcherId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   GetCompanyResearcherMandate(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`CompanyResearcherMandates/GetCompanyResearcherMandateById?lang=2&id=${id}`, { headers });
     return resopnse;
   }
   GetResearcherMandateByResearcherId(researcherId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`ResearcherMandate/GetResearcherMandateByResearcherId?researcherId=${researcherId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   GetAllResearcherMandateByResearcherId(researcherId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`ResearcherMandate/GetAllResearcherMandateByResearcherId?researcherId=${researcherId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
   CancelResearcherMandate(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`ResearcherMandate/CancelResearcherMandate?id=${id}&lang=2`,'', { headers });
     return resopnse;
   }
}
