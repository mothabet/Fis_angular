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
    debugger
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`Researcher/AddReseacher`, Model, { headers });
    return resopnse;
  }
  GetResearcherCode(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetResearcherCode`, { headers });
     return resopnse;
   }
   GetAllReseachers(){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Researcher/GetAllReseachers`, { headers });
     return resopnse;
   }
}
