import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(): boolean {
    const isLoggedIn = this.authService.getToken();
    if (isLoggedIn != "") {
      // this.userService.GetCurrentUser().subscribe((res: any) => {
      //   this.user = res.data;
      //   if (this.user != null) {
      //     return true;
      //   }
      //   else {
      //     this.router.navigate(['/Login']);
      //     return false;
      //   }
      // }, err => {
      //   this.router.navigate(['/Login']);
      //   return false;
      // })
      return true;
    } else {
      this.router.navigate(['/Login']);
      return false;
    }
  }
}
