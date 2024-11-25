import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddPercentageDto } from '../Dtos/ChangePercentageDto';

@Injectable({
  providedIn: 'root'
})
export class ChangePercentageService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  AddChangePercentage(Model: IAddPercentageDto) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `ChangePercentage/AddChangePercentage?lang=2`, Model, { headers });
    return resopnse;
  }
  GetAllChangePercentage(pageNumber:number, textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`ChangePercentage/GetAllChangePercentage?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
}
