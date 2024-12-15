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
  private arName = new BehaviorSubject<string>(''); // Initialize with a default or empty value
  constructor(private sharedService:SharedService,private http:HttpClient) { }

  setResearcherId(id: string): void {
    this.researcherId = id;
  }

  getResearcherId(): string {
    return this.researcherId;
  }
  updatePassword(formData: FormData){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.put(
      environment.apiUrl + `Auth/updatePassword?lang=2`,
      formData,
      { headers }
    );
     return resopnse;
   }

  // Observable to expose the current image URL
  currentImageUrl = this.imageUrlSubject.asObservable();
  currentArName = this.arName.asObservable();

  // Method to update the image URL
  updateImageUrl(url: string,arName:string) {
    this.imageUrlSubject.next(url);
    this.arName.next(arName);
  }
  
}
