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
  AddFormData(Model: IAddFormDataDto) {
    debugger
    var headers = this.sharedService.getHeaders();
    var resopnse = this.http.post(environment.apiUrl + `FormData/AddFormData?lang=2`, Model, { headers });
    return resopnse;
  }
}
