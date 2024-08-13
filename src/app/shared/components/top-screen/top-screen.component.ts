import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.css']
})
export class TopScreenComponent {
@Input() title = '';

constructor(private loginService: LoginService,private router: Router) {}
LogOut(){
this.loginService.deleteToken();
this.router.navigate(['/Login']);

}
}
