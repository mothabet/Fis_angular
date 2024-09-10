import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TopScreenService {
  private researcherId: string = '';
  constructor(private sharedService:SharedService,private http:HttpClient) { }

  setResearcherId(id: string): void {
    this.researcherId = id;
  }

  getResearcherId(): string {
    return this.researcherId;
  }
  updatePassword(password:string){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Auth/updatePassword?passWord=${password}&lang=2`, '', { headers });
     return resopnse;
   }
}
