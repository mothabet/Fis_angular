import { Injectable } from '@angular/core';
import { IAddGeneralIndicator, IAddOmanMap } from '../Dtos/GeneralIndicatorDto';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralIndicatorServicesService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  AddGeneralIndicator(generalIndicator: IAddGeneralIndicator) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `GeneralIndication/AddGeneralIndicator?lang=2`, generalIndicator, { headers });
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
   AddOmanGovernorate(omanGovernorate: IAddOmanMap) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `OmanMaps/AddOmanMap?lang=2`, omanGovernorate, { headers });
    return resopnse;
  }
  GetOmanMaps(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`OmanMaps/GetOmanMaps?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteOmanMap(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`OmanMaps/DeleteOmanMap?id=${id}&lang=2`, { headers });
     return response;
   }
   GetOmanMap(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `OmanMaps/GetOmanMap?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateOmanMap(id:number,omanGovernorate: IAddOmanMap){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`OmanMaps/UpdateOmanMap?id=${id}&lang=2`, omanGovernorate, { headers });
     return resopnse;
   }
}
