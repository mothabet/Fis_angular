import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(route: any): boolean {
    const isLoggedIn = this.authService.getToken();
    debugger
    if (isLoggedIn != "") {
      let res = this.authService.decodedToken(isLoggedIn);  
      const role = res.roles;
      const url: string = route.url[0].path;
      if (role === 'Company' ||role === 'Admin' && this.authService.isAdminRoute(url)) {
        return true;
      } 
      else if (role === 'Company' ||role === 'Admin' && !(this.authService.isAdminRoute(url))) {
        this.router.navigate(['/Home']);
        return true;
      } 
      else if ((role === 'Company' || role === 'Researchers') && !(this.authService.isCompanyRoute(url))) {
        this.router.navigate(['/CompanyHome']);
        return true;
      } 
      else if ((role === 'Company' || role === 'Researchers') && this.authService.isCompanyRoute(url)) {
        return true;
      } 
      
      return false;
    } else {
      this.router.navigate(['/Login']);
      return false;
    }
  }

  
}
