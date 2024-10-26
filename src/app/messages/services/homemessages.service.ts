import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddMessage } from '../Dtos/MessageDto';

@Injectable({
  providedIn: 'root'
})
export class HomemessagesService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddMessage(Model: IAddMessage){
    
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Message/AddMessage?lang=2`, Model, { headers });
     return resopnse;
   }
   
   GetAllMessages(pageNumber:number , textSearch : string =''){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.get(environment.apiUrl+`Message/GetAllMessages?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
      return resopnse;
    }
    DeleteMessage(id:number){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.delete(environment.apiUrl+`Message/DeleteMessage?id=${id}&lang=2`, { headers });
      return resopnse;
    }
    UpdateMessage(id:number,Model: IAddMessage){
     
      
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.put(environment.apiUrl+`Message/UpdateMessage?id=${id}&lang=2`, Model, { headers });
      return resopnse;
    }
    GetMessageId(id:number){
     var headers= this.sharedService.getHeaders();
      var resopnse = this.http.get(environment.apiUrl+`Message/GetMessageId?id=${id}&lang=2`, { headers });
      return resopnse;
    }
}
