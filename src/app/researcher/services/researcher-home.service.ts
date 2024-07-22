import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ResearcherHomeService {

  constructor(private sharedService:SharedService) { }
  addResearcher(){
   var headers= this.sharedService.getHeaders();
   console.log(headers);
  }
}
