import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LaunchYearService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  GetLaunchYear() {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `LaunchYear/GetLaunchYear?lang=2`, { headers });
    return resopnse;
  }
  AddLaunchYear(year: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `LaunchYear/AddLaunchYear?year=${year}&lang=2`, year, { headers });
    return resopnse;
  }
}
