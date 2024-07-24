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
    var resopnse = this.http.post(environment.apiUrl+`Researcher/AddReseacher`, Model, { headers });
    return resopnse;
  }
  GetResearcherCode(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetResearcherCode`, { headers });
     return resopnse;
   }
   GetAllReseachers(pageNumber:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetAllReseachers?pageNumber=${pageNumber}&lang=1`, { headers });
     return resopnse;
   }
   DeleteReseacher(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.delete(environment.apiUrl+`Researcher/DeleteReseacher?id=${id}`, { headers });
     return resopnse;
   }
   GetResearcherById(id:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetResearcherById?id=${id}`, { headers });
     return resopnse;
   }
   updateResearcher(id:number,Model: IAddResearcher){
    debugger
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Researcher/UpdateResearcher?id=${id}`, Model, { headers });
     return resopnse;
   }
}
