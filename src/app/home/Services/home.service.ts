import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  GetGeneralIndicatorsChart(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Home/GetGeneralIndicatorsChart?lang=2`, { headers });
    return resopnse;
  }
  GetMapGovData(id: number,govName:string) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Home/GetMapGovData?lang=2&govName=${govName}`, { headers });
    return resopnse;
  }
}
