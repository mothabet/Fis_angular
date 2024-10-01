import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  showSidebar: BehaviorSubject<boolean>
  
  constructor(private http: HttpClient) {
    this.showSidebar = new BehaviorSubject(true)
  }
  hide(){
    this.showSidebar.next(false);
  }
  show(){
    this.showSidebar.next(true);
  }
}
