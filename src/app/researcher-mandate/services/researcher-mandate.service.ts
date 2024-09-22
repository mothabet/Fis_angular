import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddListResearcherMandateDto, IAddResearcherMandateDto } from 'src/app/researcher/Dtos/ResearcherDetailsDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

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
   GetResearcherMandateByResearcherId(researcherId:string,pageNumber:number, textSearch : string ='',withNull:boolean = true){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`ResearcherMandate/GetResearcherMandateByResearcherId?researcherId=${researcherId}&pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&withNull=${withNull}`, { headers });
     return resopnse;
   }
}
