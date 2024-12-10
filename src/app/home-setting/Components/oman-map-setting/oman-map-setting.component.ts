import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { LaunchYearService } from '../../Services/launch-year.service';
import { MapSettingService } from '../../Services/map-setting.service';

@Component({
  selector: 'app-oman-map-setting',
  templateUrl: './oman-map-setting.component.html',
  styleUrls: ['./oman-map-setting.component.css']
})
export class OmanMapSettingComponent {
  showLoader: boolean = false;
  years: number[] = [];
  currentYear: number = 0;
  reviewYear :number = 0;
  reviewType :number = 0;
  constructor(private fb: FormBuilder, private sharedService: SharedService,private mapSettingServices : MapSettingService) { }
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear(); // Get the current year
    for (let year = 2007; year <= this.currentYear; year++) {
      this.years.push(year);
    }
    this.GetMapSetting();
  }
  GetMapSetting(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.reviewYear = res.Data.reviewYear;
          this.reviewType = res.Data.reviewType;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.mapSettingServices.GetMapSetting().subscribe(observer);
  }
  SaveMapSetting(): void {
    this.showLoader = true;
    const model = {
      reviewYear : this.reviewYear,
      reviewType : this.reviewType
    }
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res) {
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.mapSettingServices.SaveMapSetting(model).subscribe(observer);
  }
}
