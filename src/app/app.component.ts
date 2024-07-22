import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SidebarService } from './shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showSidebar = true;
  subcription!: Subscription;
  constructor(private service: SidebarService, private titleService: Title) {

  }
  ngOnInit() {
    this.titleService.setTitle('المركز الوطنى للاحصاء والمعلومات');
    this.subcription = this.service.showSidebar.subscribe((value) => {
      this.showSidebar = value;
    })
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
