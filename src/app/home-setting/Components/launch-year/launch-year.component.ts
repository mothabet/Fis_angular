import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LaunchYearService } from '../../Services/launch-year.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-launch-year',
  templateUrl: './launch-year.component.html',
  styleUrls: ['./launch-year.component.css']
})
export class LaunchYearComponent implements OnInit {
  showLoader: boolean = false;
  percentageForm!: FormGroup;
  id: number = 0;
  years: number[] = [];
  currentYear: number = 0;
  launchYear :number = 0;
  constructor(private fb: FormBuilder, private sharedService: SharedService,private launchYearServices : LaunchYearService) { }
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear(); // Get the current year
    for (let year = 2007; year <= this.currentYear; year++) {
      this.years.push(year);
    }
    this.GetLaunchYear();
  }
  GetLaunchYear(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.launchYear = res.Data
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.launchYearServices.GetLaunchYear().subscribe(observer);
  }
  SavePercentage(): void {
    this.showLoader = true;
    debugger
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
    this.launchYearServices.AddLaunchYear(+this.launchYear).subscribe(observer);
  }
}
