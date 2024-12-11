import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  GetProfileByUserId(){
    
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Auth/GetProfileByUserId`, { headers });
     return response;
   }
}
