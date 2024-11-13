import { Injectable } from '@angular/core';
import { IAddGeneralIndicator } from '../Dtos/GeneralIndicatorDto';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralIndicatorServicesService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  AddGeneralIndicator(Report: IAddGeneralIndicator) {
    
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `GeneralIndication/AddGeneralIndicator?lang=2`, Report, { headers });
    return resopnse;
  }
  GetGeneralIndicators(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`GeneralIndication/GetGeneralIndicators?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteGeneralIndicator(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`GeneralIndication/DeleteGeneralIndicator?id=${id}&lang=2`, { headers });
     return response;
   }
   GetGeneralIndicator(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `GeneralIndication/GetGeneralIndicator?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateGeneralIndicator(id:number,reportDto: IAddGeneralIndicator){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`GeneralIndication/UpdateGeneralIndicator?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
}
