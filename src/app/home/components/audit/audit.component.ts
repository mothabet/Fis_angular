import { Component } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IGetAuditDto } from '../../Dtos/HomeDto';
import { IGetPercentageDto } from 'src/app/home-setting/Dtos/ChangePercentageDto';
import { ChangePercentageService } from 'src/app/home-setting/Services/change-percentage.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  showLoader: boolean = false;
  getAuditDto : IGetAuditDto[] = [];
  getAuditDtoPagination : IGetAuditDto[] = [];
  changePercentage:number = 0;
  getPercentage:IGetPercentageDto[]=[]
  currentYear: number=0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  constructor(private sharedService: SharedService, private homeService: HomeService, private changePercentageService: ChangePercentageService) { }
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear(); // Get the current year
    this.GetAllAudit();
    this.GetAllPercentage()
  }
  onPageChange(page: number) {
    const rowsPerPage = 15; // Number of rows per page
    this.currentPage = page;
  
    // Calculate the total number of pages
    this.totalPages = Math.ceil(this.getAuditDto.length / rowsPerPage);
  
    // Determine if the current page is the last page
    this.isLastPage = page === this.totalPages;
  
    // Calculate start and end indices for slicing
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
  
    // Slice the array for pagination
    this.getAuditDtoPagination = this.getAuditDto.slice(startIndex, endIndex);
  }
  
  
  GetAllAudit(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.getAuditDto = res.Data;
          this.onPageChange(1)
        }
        else {
          this.getAuditDto = [];
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
  GetAllPercentage(): void {
    const observer = {
      next: (res: any) => {
        
        
        if (res.Data) {
          this.getPercentage = res.Data;
          this.changePercentage = this.getPercentage[this.getPercentage.length-1].percentage;
          this.currentYear = this.getPercentage[this.getPercentage.length-1].formYear;
        }
        else {
          this.getPercentage = [];
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.changePercentageService.GetAllChangePercentage(0).subscribe(observer);
  }
}
