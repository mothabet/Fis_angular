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
   AddActivity(Activity: IAddActivityDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Activity/AddActivity?lang=2`, Activity, { headers });
     return resopnse;
   }
   GetActivities(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Activity/GetActivities?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   AddSubActivity(subActivity: IAddSubActivityDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`SubActivity/AddSubActivity?lang=2`, subActivity, { headers });
     return resopnse;
   }
   GetSubActivity(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`SubActivity/GetSubActivities?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
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
}
