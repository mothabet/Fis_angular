import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddSubCode } from '../Dtos/SubCodeHomeDto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubCodeHomeService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  AddSubCode(Model: IAddSubCode[]){
    debugger
   var headers= this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl+`SubCodes/AddSubCode?lang=2`, Model, { headers });
    return resopnse;
  }
}
