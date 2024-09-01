import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  headers !: HttpHeaders
  private coverForm!: ICoverFormDetailsDto;
  constructor(private http: HttpClient, private loginService: LoginService) {
    const savedCoverForm = localStorage.getItem('coverForm');
    if (savedCoverForm) {
      this.coverForm = JSON.parse(savedCoverForm);
    }
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
    if (err.status) {
      switch (err.status) {
        case 400:
          if (err.error.Error != null) {
            Swal.fire({
              icon: 'error',
              title: err.error.Errors[0],
              showConfirmButton: true,
              confirmButtonText: 'اغلاق'
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: err.error.Message,
              showConfirmButton: true,
              confirmButtonText: 'اغلاق'
            });
          }
          break;
        case 401:
          Swal.fire({
            icon: 'error',
            title: `Unauthorized ${err.message}`,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          break;
        case 403:
          Swal.fire({
            icon: 'error',
            title: `Forbidden ${err.message}`,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          break;
        case 404:
          Swal.fire({
            icon: 'error',
            title: `Not Found ${err.message}`,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          break;
        case 500:
          Swal.fire({
            icon: 'error',
            title: `Internal Server Error ${err.message}`,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: `An unexpected error occurred ${err.message}`,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: `An unknown error occurred ${err.message}`,
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
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
