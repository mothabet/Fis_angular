import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddReportDto } from '../Dtos/ReportDto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }

  AddReport(Report: IAddReportDto){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.post(environment.apiUrl+`Report/AddReport?lang=2`, Report, { headers });
     return resopnse;
   }
   GetReports(pageNumber:number , textSearch : string =''){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Report/GetReports?pageNumber=${pageNumber}&lang=2&textSearch=${textSearch}`, { headers });
     return resopnse;
   }
   DeleteReport(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Report/DeleteReport?id=${id}`, { headers });
     return response;
   }
}
