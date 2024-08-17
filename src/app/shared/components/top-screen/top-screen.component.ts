import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.css']
})
export class TopScreenComponent implements OnInit
{
  @Input() title = '';
  role: string = "";
  arName: string = "";
  Loader = false;
  constructor(private loginService: LoginService, private router: Router,private authService: LoginService) { }
  ngOnInit(): void {
    this.Loader = true
    const isLoggedIn = this.authService.getToken();
    debugger
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    this.arName = result.arName;
  }
  LogOut() {
    this.loginService.deleteToken();
    this.router.navigate(['/Login']);

  }
}
