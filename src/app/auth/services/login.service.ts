import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../Dtos/AuthDto';
import { environment } from 'src/environments/environment.development';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  LogIn(model: ILogin) {
    var logIn = this.http.post(environment.apiUrl + 'Auth/Login?lang=2', model);
    return logIn;
  }
  saveToken(token: string) {
    // Define a secret key for encryption. 
    // Make sure to use a secure way to manage and store your key.
    const secretKey = 'your-256-bit-secret-key';

    // Encrypt the token
    const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();

    // Save the encrypted token in a cookie
    this.cookieService.set('ATKFIS', encryptedToken);

    console.log('Token saved:', encryptedToken);
  }
  getToken(): string {
    const secretKey = 'your-256-bit-secret-key';
    const encryptedToken = this.cookieService.get('ATKFIS');

    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedToken;
    }

    return '';
  }
  deleteToken() {
    const token = this.cookieService.delete('ATKFIS');
    return token;
  }
  decodedToken(token: string) : any {
    const decodedToken = jwtDecode(token);
    // Log the decoded data
    return decodedToken
  }
}
