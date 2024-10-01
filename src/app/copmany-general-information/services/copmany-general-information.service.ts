import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddCompanyGeneralInformations } from '../Dtos/CompanyGeneralInformationDto';

@Injectable({
  providedIn: 'root'
})
export class CopmanyGeneralInformationService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  GetCopmanyGeneralInformationId(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`CopmanyGeneralInformation/GetCopmanyGeneralInformationId?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetAllCopmanyGeneralInformations(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`CopmanyGeneralInformation/GetAllCopmanyGeneralInformations?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteCopmanyGeneralInformation(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`CopmanyGeneralInformation/DeleteCopmanyGeneralInformation?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   UpdateCompanyGeneralInformation(id:number,Model: IAddCompanyGeneralInformations){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`CopmanyGeneralInformation/UpdateCompanyGeneralInformation?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
   AddCompanyGeneralInformation(Model: IAddCompanyGeneralInformations){
    var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`CopmanyGeneralInformation/AddCompanyGeneralInformation?lang=2`, Model, { headers });
    return resopnse;
   }
}
