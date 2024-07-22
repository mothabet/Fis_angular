import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  headers !: HttpHeaders
  constructor(private http: HttpClient, private loginService: LoginService) {

  }
  getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Assuming you are using a bearer token for authentication
    });
    return this.headers;
  }
}
