import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddDataMaximize } from '../Dto/DataMaximizeDto';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MaximizeService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  AddDataMaxmize(dataMaximize: IAddDataMaximize, lang : number = 2) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `DataMaxmize/AddDataMaxmize?lang=${lang}`, dataMaximize, { headers });
    return resopnse;
  }
  GetDataMaxmizes(pageNumber: number, textSearch: string = '' , lang : number = 2) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `DataMaxmize/GetDataMaxmizes?pageNumber=${pageNumber}&lang=${lang}&textSearch=${textSearch}`, { headers });
    return resopnse;
  }
  DeleteDataMaxmize(id: number,lang:number = 2) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.delete(environment.apiUrl + `DataMaxmize/DeleteDataMaxmize?id=${id}&lang=${lang}`, { headers });
    return response;
  }
  GetDataMaxmize(id: number) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `DataMaxmize/GetDataMaxmize?id=${id}&lang=2`, { headers });
    return resopnse;
  }
  GetDataMaximizeDetails(id: number,type:number,lang:number=2) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.get(environment.apiUrl + `DataMaxmize/GetDataMaximizeDetails?id=${id}&lang=${lang}&type=${type}`, { headers });
    return resopnse;
  }
  UpdateDataMaxmize(id: number, reportDto: IAddDataMaximize,lang:number = 2) {
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.put(environment.apiUrl + `DataMaxmize/UpdateDataMaxmize?id=${id}&lang=${lang}`, reportDto, { headers });
    return resopnse;
  }
}
