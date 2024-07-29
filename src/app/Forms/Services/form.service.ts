import { Injectable } from '@angular/core';
import { IAddForm } from '../Dtos/FormDto';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  addForm(Model: IAddForm) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.post(environment.apiUrl + `Form/AddForm`, Model, { headers });
    return response;
  }
}
