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
    // this.authService.decodedToken(isLoggedIn);
    if (isLoggedIn != "") {
      let res = this.authService.decodedToken(isLoggedIn);  
    const role = res.roles;
    debugger
    if(role === 'Admin'){
      return true;
    }
    else{
      return true;
    }
    } else {
      this.router.navigate(['/Login']);
      return false;
    }
  }
}
