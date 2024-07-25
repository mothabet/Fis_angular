import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(): boolean {
    const isLoggedIn = this.authService.getToken();
    if (isLoggedIn == "") {
      return true;
    } else {
      // this.userService.GetCurrentUser().subscribe((res: any) => {
      //   this.user = res.data;
      //   if (this.user != null) {
      //     this.router.navigate(['/Home']);
      //     return false;
      //   }
      //   else {
      //     return true;

      //   }
      // }, err => {
      //   return true;

      // })
      this.router.navigate(['/Home']);
      return true;
    }
  }
}
