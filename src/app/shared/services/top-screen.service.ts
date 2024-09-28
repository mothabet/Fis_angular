import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopScreenService {
  private researcherId: string = '';
  private imageUrlSubject = new BehaviorSubject<string>(''); // Initialize with a default or empty value
  constructor(private sharedService:SharedService,private http:HttpClient) { }

  setResearcherId(id: string): void {
    this.researcherId = id;
  }

  getResearcherId(): string {
    return this.researcherId;
  }
  updatePassword(password:string){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(environment.apiUrl+`Auth/updatePassword?passWord=${password}&lang=2`, '', { headers });
     return resopnse;
   }

  // Observable to expose the current image URL
  currentImageUrl = this.imageUrlSubject.asObservable();

  // Method to update the image URL
  updateImageUrl(url: string) {
    this.imageUrlSubject.next(url);
  }
}
