import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(route: any): boolean {
    const isLoggedIn = this.authService.getToken();
    if (isLoggedIn == "") {
      return true;
    } else {
      let res = this.authService.decodedToken(isLoggedIn);  
      const role = res.roles;
      const url: string = route.url[0].path;

      if (role === 'Admin' && this.authService.isAdminRoute(url)) {
        return true;
      } 
      else if (role === 'Admin' && !(this.authService.isAdminRoute(url))) {
        this.router.navigate(['/Home']);
        return true;
      } 
      else if (role === 'Company' && !(this.authService.isCompanyRoute(url))) {
        this.router.navigate(['/CompanyHome']);
        return true;
      } 
      else if (role === 'Company' && this.authService.isCompanyRoute(url)) {
        return true;
      } 
      
      return false;
    }
  }
}
