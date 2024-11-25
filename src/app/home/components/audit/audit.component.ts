import { Component } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IGetAuditDto } from '../../Dtos/HomeDto';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  showLoader: boolean = false;
  getAuditDto : IGetAuditDto[] = []
  constructor(private sharedService: SharedService, private homeService: HomeService) { }
  ngOnInit(): void {
    
  }
  GetAllAudit(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          
        }
        else {
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.homeService.GetAllAudit().subscribe(observer);
  }
}
