import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import Swal from 'sweetalert2';

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
  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  handleError(err: any): void {
    debugger
    if (err.status) {
      switch (err.status) {
        case 400:
          if(err.error.Error != null){
            Swal.fire({
              icon: 'error',
              title: err.error.Errors[0],
              showConfirmButton: false,
              timer: 2000
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: err.error.Message,
              showConfirmButton: false,
              timer: 1500
            });
          }
          break;
        case 401:
          Swal.fire({
            icon: 'error',
            title: `Unauthorized ${err.message}`,
            showConfirmButton: false,
            timer: 1500
          });
          break;
        case 403:
          Swal.fire({
            icon: 'error',
            title: `Forbidden ${err.message}`,
            showConfirmButton: false,
            timer: 1500
          });
          break;
        case 404:
          Swal.fire({
            icon: 'error',
            title: `Not Found ${err.message}`,
            showConfirmButton: false,
            timer: 1500
          });
          break;
        case 500:
          Swal.fire({
            icon: 'error',
            title: `Internal Server Error ${err.message}`,
            showConfirmButton: false,
            timer: 1500
          });
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: `An unexpected error occurred ${err.message}`,
            showConfirmButton: false,
            timer: 1500
          });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: `An unknown error occurred ${err.message}`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  validateInput(event: KeyboardEvent): void {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Allow only numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  generateYears(start: number, end: number): number[] {
    const years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  }
}
