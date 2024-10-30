import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddSettingsAuthAndPermissionDto } from '../Dtos/SettingsAuthHomeDto';

@Injectable({
  providedIn: 'root'
})
export class SettingsAuthService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  GetSettingsAuthCode() {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `SettingsAuth/GetSettingsAuthCode?lang=2`, { headers });
    return resopnse;
  }
  AddSettingsAuth(Model: IAddSettingsAuthAndPermissionDto) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `SettingsAuth/AddSettingsAuth?lang=2`, Model, { headers });
    return resopnse;
  }
  GetAllSettingsAuths(pageNumber: number, textSearch: string = '') {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `SettingsAuth/GetAllSettingsAuths?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
    return resopnse;
  }
  DeleteSettingsAuth(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.delete(environment.apiUrl + `SettingsAuth/DeleteSettingsAuth?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  GetSettingsAuthById(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `SettingsAuth/GetSettingsAuthById?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  UpdateSettingsAuth(id:number,Model: IAddSettingsAuthAndPermissionDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`SettingsAuth/UpdateSettingsAuth?id=${id}&lang=2`, Model, { headers });
     return resopnse;
   }
}
