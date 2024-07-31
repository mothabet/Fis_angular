import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddResearcher } from '../Dtos/ResearcherHomeDto';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResearcherHomeService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  addResearcher(Model: IAddResearcher){
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`Researcher/AddReseacher?lang=2`, Model, { headers });
    return resopnse;
  }
  GetResearcherCode(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetResearcherCode?lang=2`, { headers });
     return resopnse;
   }
   GetAllReseachers(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetAllReseachers?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteReseacher(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Researcher/DeleteReseacher?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   GetResearcherById(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetResearcherById?id=${id}&lang=2`, { headers });
     return resopnse;
   }
   updateResearcher(id:number,Model: IAddResearcher){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Researcher/UpdateResearcher?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
}
