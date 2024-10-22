import { Injectable } from '@angular/core';
import { IAddActivityDto, IAddCategory, IAddGroupDto, IAddSectorDto, IAddSubActivityDto } from '../Dtos/SectorDtos';
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
   GetGroups(pageNumber:number , textSearch : string ='',sectorId:number = 0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Group/GetGroups?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&sectorId=${sectorId}`, { headers });
     return resopnse;
   }
   DeleteGroup(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Group/DeleteGroup?id=${id}`, { headers });
     return response;
   }
   GetGroup(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Group/GetGroup?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateGroup(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Group/UpdateGroup?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
   AddGroup(Activity: IAddGroupDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Group/AddGroup?lang=2`, Activity, { headers });
     return resopnse;
   }
   AddCategory(Activity: IAddCategory){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Category/AddCategory?lang=2`, Activity, { headers });
     return resopnse;
   }
   GetCategories(pageNumber:number , textSearch : string ='',sectorId:number = 0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Category/GetCategories?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&sectorId=${sectorId}`, { headers });
     return resopnse;
   }
   DeleteCategory(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Category/DeleteCategory?id=${id}`, { headers });
     return response;
   }
   GetCategory(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Category/GetCategory?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateCategory(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Category/UpdateCategory?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
   AddSection(Section: IAddActivityDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Section/AddSection?lang=2`, Section, { headers });
     return resopnse;
   }
   GetSections(pageNumber:number , textSearch : string ='',sectorId:number = 0){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Section/GetSections?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}&sectorId=${sectorId}`, { headers });
     return resopnse;
   }
   DeleteSection(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Section/DeleteSection?id=${id}`, { headers });
     return response;
   }
   GetSection(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Section/GetSection?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateSection(id:number,reportDto: IAddSectorDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Section/UpdateSection?id=${id}&lang=2`, reportDto, { headers });
     return resopnse;
   }
}
