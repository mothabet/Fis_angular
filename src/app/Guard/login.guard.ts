import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/services/login.service';
import { SharedService } from '../shared/services/shared.service';
import { PermissionsService } from '../permissions/services/permissions.service';
import { IGetPermissionDto } from '../permissions/Dtos/PermissionDto';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  permissions: IGetPermissionDto[] = [];
  constructor(private router: Router, private authService: LoginService
    , private permissionsService: PermissionsService, private sharedService: SharedService) { }

  canActivate(route: any): boolean {
    
    const isLoggedIn = this.authService.getToken();
    if (isLoggedIn != "") {
      let res = this.authService.decodedToken(isLoggedIn);
      const role = res.roles;
      const url: string = route.url[0].path;
      const savedLang = localStorage.getItem('language') || 'ar';
      if (!(this.authService.isTableRoute(url))) {
        localStorage.clear();
        localStorage.setItem('language', savedLang);
      }
      if ((role === "User" && this.authService.isUserRoute(url)) || (role === "Researchers" && (this.authService.isUserRoute(url) || this.authService.isResearcherRoute(url)))) {
        const observer = {
          next: (_res: any) => {

            if (_res.Data) {
              this.permissions = _res.Data;
              const permissionCheck = this.permissions.find(r => r.enName === url);
              if (permissionCheck && permissionCheck.isName) {
                return true;
              }
              else if (!permissionCheck && this.authService.isTableRoute(url)) {
                return true;
              }
              else if (role === 'Researchers' && (this.authService.isResearcherRoute(url))) {
                return true;
              }
              else {
                this.router.navigate(['/Home']);
                return true;
              }
            }
            else {
              if (role === 'Researchers' && (this.authService.isResearcherRoute(url))) {
                return true;
              }
              this.router.navigate(['/Home']);
              return true;
            }
          },
          error: (err: any) => {

            this.sharedService.handleError(err);
          },
        };
        this.permissionsService.GetPermissionByUserId(res.id).subscribe(observer);
        return true
      }
      else if ((role === "User" || role === 'Researchers') && !(this.authService.isUserRoute(url))) {
        this.router.navigate(['/Home']);
        return true;
      }
      else {

        if (role === 'Admin' && this.authService.isAdminRoute(url)) {
          return true;
        }
        else if (role === 'Admin' && !(this.authService.isAdminRoute(url))) {
          this.router.navigate(['/Home']);
          return true;
        }
        else if ((role === 'User' || role === 'Researchers') && this.authService.isAdminRoute(url)) {
          return true;
        }
        else if ((role === 'User' || role === 'Researchers') && !(this.authService.isAdminRoute(url))) {
          this.router.navigate(['/Home']);
          return true;
        }
        else if (role === 'Company' && !(this.authService.isCompanyRoute(url))) {
          this.router.navigate(['/Companies-Details', res.id]);
          return true;
        }
        else if (role === 'Company' && this.authService.isCompanyRoute(url)) {
          return true;
        }
        else if (role === 'Researchers' && !(this.authService.isResearcherRoute(url))) {
          this.router.navigate(['/Researcher-Details', res.id]);
          return true;
        }
        else if (role === 'Researchers' && this.authService.isResearcherRoute(url)) {
          return true;
        }
        return false;
      }
    } else {
      this.router.navigate(['/Login']);
      return false;
    }

  }
}