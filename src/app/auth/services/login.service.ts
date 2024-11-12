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
    const secretKey = 'your-256-bit-secret-key';
    const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
    this.cookieService.set('ATKFIS', encryptedToken, undefined, '/'); // Ensure correct path
  }

  getToken(): string {
    const secretKey = 'your-256-bit-secret-key';
    const encryptedToken = this.cookieService.get('ATKFIS');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return '';
  }

  deleteToken() {
    this.cookieService.delete('ATKFIS', '/'); // Ensure correct path
  }

  decodedToken(token: string): any {
    if (token) {
      return jwtDecode(token);
    }
    return '';
  }
  isAdminRoute(url: string): boolean {
    const adminRoutes = [
      'CompanyHome',
      'Home',
      'Forms',
      'Companies',
      'Researcher',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'CopmanyMessages',
      'CopmanyGeneralInformation',
      'Certification',
      'WorkData',
      'QuarterTable',
      'QuarterFormCover',
      'TransTable',
      'PeriodTable',
      'TableWithoutTrans',
      'TablePercentageWithoutTrans',
      'OneYearWithParts',
      'OneYearWithPartsAndTotal',
      'TwoYearsWithParts',
      'FormDetails',
      'Companies-Details',
      'Researcher-Details',
      'Reports',
      'ReportContents',
      'Countries',
      'Activities',
      'Sectors',
      'Groups',
      'Categories',
      'SettingsAuth',
      'Sections',
      'GeneralIndicators',
      'OmanMaps'
    ];
    return adminRoutes.includes(url);
  }
  isUserRoute(url: string): boolean {
    const adminRoutes = [
      'CompanyHome',
      'Home',
      'Forms',
      'Companies',
      'Researcher',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'CopmanyMessages',
      'CopmanyGeneralInformation',
      'Certification',
      'WorkData',
      'QuarterTable',
      'QuarterFormCover',
      'TransTable',
      'PeriodTable',
      'TableWithoutTrans',
      'TablePercentageWithoutTrans',
      'OneYearWithParts',
      'OneYearWithPartsAndTotal',
      'TwoYearsWithParts',
      'FormDetails',
      'Companies-Details',
      'Researcher-Details',
      'Reports',
      'ReportContents',
      'Countries',
      'Activities',
      'Sectors',
      'SettingsAuth'
    ];
    return adminRoutes.includes(url);
  }


  isCompanyRoute(url: string): boolean {
    const companyRoutes = [
      'CompanyHome', 'PrevForm', 'Certification',
      'WorkData',
      'QuarterTable',
      'QuarterFormCover',
      'TransTable',
      'PeriodTable',
      'TableWithoutTrans',
      'TablePercentageWithoutTrans',
      'OneYearWithParts',
      'OneYearWithPartsAndTotal',
      'TwoYearsWithParts',
      'FormDetails',
      'Companies-Details',
      'SharedTwoYearsWithParts'
    ];
    return companyRoutes.includes(url);
  }

  isResearcherRoute(url: string): boolean {
    const researcherRoutes = [
      'CompanyHome', 'PrevForm', 'Certification',
      'WorkData',
      'QuarterTable',
      'QuarterFormCover',
      'TransTable',
      'PeriodTable',
      'TableWithoutTrans',
      'TablePercentageWithoutTrans',
      'OneYearWithParts',
      'OneYearWithPartsAndTotal',
      'TwoYearsWithParts',
      'FormDetails',
      'Researcher-Details',
      'SharedTwoYearsWithParts',
      'Companies-Details',
      'Companies-Researcher'
    ];
    return researcherRoutes.includes(url);
  }
  isTableRoute(url: string): boolean {
    const companyRoutes = [
      'TransTable',
      'PeriodTable',
      'TableWithoutTrans',
      'TablePercentageWithoutTrans',
      'OneYearWithParts',
      'OneYearWithPartsAndTotal',
      'TwoYearsWithParts',
      'QuarterTable',
      'QuarterFormCover',
      'Certification',
      'FormDetails',
      'WorkData'
    ];
    return companyRoutes.includes(url);
  }
}
