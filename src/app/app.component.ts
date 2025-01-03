import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SidebarService } from './shared/services/sidebar.service';
import { Subscription } from 'rxjs';
import { LoginService } from './auth/services/login.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  role:string = "";
  Loader = false;
  showSidebar = true;
  subcription!: Subscription;
  savedLang: string = '';
  constructor(private cdr: ChangeDetectorRef,private service: SidebarService, private titleService: Title,private authService: LoginService) {
    
  }
  ngOnInit() {
    this.savedLang = localStorage.getItem('language') || 'ar';
    this.titleService.setTitle('المركز الوطنى للاحصاء والمعلومات');
    this.subcription = this.service.showSidebar.subscribe((value) => {
      this.showSidebar = value;
    })
    this.Loader = true
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorage(event: Event): void {
  //   // Clear localStorage
  //   localStorage.clear();
  // }
}

 