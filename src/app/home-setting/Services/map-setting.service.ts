import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mode } from 'crypto-js';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MapSettingService {
  constructor(private sharedService: SharedService, private http: HttpClient) { }
  GetMapSetting() {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `MapSetting/GetMapSetting?lang=2`, { headers });
    return resopnse;
  }
  SaveMapSetting(model: any) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `MapSetting/AddMapSetting?lang=2`, model, { headers });
    return resopnse;
  }
}
