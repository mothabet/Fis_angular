import { Injectable } from '@angular/core';
import { IAddFormDataDto } from '../components/navigate-tables-types/Dtos/FormDataDto';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NavigateTablesTypesService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  AddFormData(Model: IAddFormDataDto,btnTpe:string = "") {
    debugger
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `FormData/AddFormData?lang=2&btnTpe=${btnTpe}`, Model, { headers });
    return resopnse;
  }
}
