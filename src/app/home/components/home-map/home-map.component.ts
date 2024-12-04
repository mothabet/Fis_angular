import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeService } from '../../Services/home.service';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.css']
})
export class HomeMapComponent implements OnInit{
  selectedGovernorate: string | null = null; // اسم المحافظة المختارة
  showLoader: boolean = false;
  govData:any;
  hasData: boolean = false;


  constructor(private sharedService: SharedService, private homeServices: HomeService) {
    
  }
  ngOnInit(){
    
  }
  onSvgLoad(event: any): void {
    const svgDoc = event.target.contentDocument;
    if (svgDoc) {
      // الوصول إلى أجزاء الخريطة حسب معرفات الأجزاء في ملف SVG
      const regions = svgDoc.querySelectorAll('path');

      // إضافة الأحداث لكل جزء
      regions.forEach((region: any) => {
        region.addEventListener('click', () => {
          this.onRegionClick(region.id);
        });
      });
    }
  }

  onRegionClick(regionId: string): void {

    // يمكنك هنا تنفيذ أي إجراء بناءً على الجزء الذي تم النقر عليه
    alert(`You clicked on ${regionId}`);
  }

  showGovernorate(governorate: string): void {
    this.selectedGovernorate = governorate;
    this.GetMapGovData(governorate)
  }
  GetMapGovData(govName:string) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.govData = res.Data;
          this.hasData = true;
        }
        else{
          this.hasData = false;
          this.govData = []
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };

    this.homeServices.GetMapGovData(0,govName).subscribe(observer);
  }
}
