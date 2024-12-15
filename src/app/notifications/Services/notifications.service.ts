import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  GetNotificationsByUserId(pageNumber: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Notifications/GetNotificationsByUserId?pageNumber=${pageNumber}&lang=2`, { headers });
    return resopnse;
  }
  GetNotificationsCountByUserId() {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `Notifications/GetNotificationsCountByUserId?lang=2`, { headers });
    return resopnse;
  }
  UpdateToReadNotificationByUserId() {
    debugger
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.put(environment.apiUrl + `Notifications/UpdateToReadNotificationByUserId?lang=2`,null, { headers });
    return resopnse;
  }
}
