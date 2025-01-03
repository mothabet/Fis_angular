import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { ChangePercentageService } from '../../Services/change-percentage.service';
import { IAddPercentageDto, IGetPercentageDto } from '../../Dtos/ChangePercentageDto';

@Component({
  selector: 'app-change-percentage',
  templateUrl: './change-percentage.component.html',
  styleUrls: ['./change-percentage.component.css']
})
export class ChangePercentageComponent implements OnInit {
  showLoader: boolean = false;
  percentageForm!: FormGroup;
  id:number = 0;
  getPercentage:IGetPercentageDto[]=[];
  years: number[] = [];
  currentYear: number=0;
  constructor(private fb: FormBuilder, private sharedService: SharedService, private changePercentageService: ChangePercentageService) { }
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear(); // Get the current year
    for (let year = 2007; year <= this.currentYear; year++) {
      this.years.push(year);
    }
    this.GetAllPercentage();
    
    this.percentageForm = this.fb.group({
      percentage: [0, Validators.required],
      formYear: [this.currentYear, Validators.required],
    });
  }
  SavePercentage(): void {
    this.showLoader = true;
    if (!this.percentageForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return;
    }
    const Model: IAddPercentageDto = {
      id: this.id,
      percentage: this.percentageForm.value.percentage,
      formYear: this.percentageForm.value.formYear,
    };
    const observer = {
      next: (res: any) => {
        this.GetAllPercentage();
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
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
    this.changePercentageService.AddChangePercentage(Model).subscribe(observer);
  }
  GetAllPercentage(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.getPercentage = res.Data;
          this.id = this.getPercentage[0].id;
          this.percentageForm.patchValue({
            percentage: this.getPercentage[this.getPercentage.length - 1].percentage,
            formYear: this.getPercentage[this.getPercentage.length - 1].formYear,
          });
        }
        else {
          this.getPercentage = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.changePercentageService.GetAllChangePercentage(0).subscribe(observer);
  }
}
