import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role:string = "";
  id:number=0;
  isSidebarExpanded = false;

  constructor(private router: Router, private authService: LoginService) { }

  ngOnInit(): void {
    const isLoggedIn = this.authService.getToken();
    let res = this.authService.decodedToken(isLoggedIn);  
    this.role = res.roles;
    this.id = res.id;
  }
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
