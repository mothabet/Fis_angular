import { Injectable } from '@angular/core';
import { IAddActivityDto, IAddSectorDto, IAddSubActivityDto } from '../Dtos/SectorDtos';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SectorAndActivitiesService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddSector(Sector: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Sector/AddSector?lang=2`, Sector, { headers });
     return resopnse;
   }
   GetSectors(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Sector/GetSectors?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteSector(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Sector/DeleteSector?id=${id}`, { headers });
     return response;
   }
   GetSector(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Sector/GetSector?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateSector(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Sector/UpdateSector?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
   AddActivity(Activity: IAddActivityDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Activity/AddActivity?lang=2`, Activity, { headers });
     return resopnse;
   }
   GetActivities(pageNumber:number , textSearch : string ='',sectorId:number = 0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Activity/GetActivities?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&sectorId=${sectorId}`, { headers });
     return resopnse;
   }
   getActivityByActivityId(activityId:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Activity/getActivityByActivityId?lang=2&activityId=${activityId}`, { headers });
     return resopnse;
   }
   DeleteActivity(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Activity/DeleteActivity?id=${id}`, { headers });
     return response;
   }
   GetActivity(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Activity/GetActivity?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateActivity(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Activity/UpdateActivity?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
   AddSubActivity(subActivity: IAddSubActivityDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`SubActivity/AddSubActivity?lang=2`, subActivity, { headers });
     return resopnse;
   }
   GetSubActivities(pageNumber:number , textSearch : string ='',activityId:number =0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`SubActivity/GetSubActivities?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&activityId=${activityId}`, { headers });
     return resopnse;
   }
   DeleteSubActivity(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`SubActivity/DeleteSubActivity?id=${id}`, { headers });
     return response;
   }
   GetSubActivity(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `SubActivity/GetSubActivity?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateSubActivity(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`SubActivity/UpdateSubActivity?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
   AddCountry(Sector: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Country/AddCountry?lang=2`, Sector, { headers });
     return resopnse;
   }
   GetCountries(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Country/GetCountries?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteCountry(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Country/DeleteCountry?id=${id}`, { headers });
     return response;
   }
   GetCountry(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Country/GetCountry?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateCountry(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Country/UpdateCountry?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
}
