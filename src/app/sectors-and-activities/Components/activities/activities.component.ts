import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddActivityDto, IAddSectorDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit{
  activityForm!: FormGroup;
  showLoader: boolean = false;
  activities!:IGetSectorDto[];
  sectors!:IGetSectorDto[];
  constructor(    private sharedService: SharedService,private fb: FormBuilder,
    private toastr: ToastrService,private sectorsAndActivitiesServices:SectorAndActivitiesService) {}

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      sectorId : ['', Validators.required],
    });
    this.GetActivities(1,'',)
    this.GetSectors(1,'',)
  }
  onSave(): void {
    this.showLoader = true;
    if (this.activityForm.valid) {
      const activity : IAddActivityDto = {
        arName : this.activityForm.value.arName,
        enName : this.activityForm.value.enName,
        code : this.activityForm.value.code,
        sectorId : this.activityForm.value.sectorId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.activityForm.reset();
          this.GetActivities(1,'');
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.AddActivity(activity).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  GetActivities(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(page, textSearch).subscribe(observer);
  }
  onReset(): void {
    this.activityForm.reset();
  }
  GetSectors(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data;
          this.activityForm.patchValue({ sectorId: this.sectors[0].id });
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSectors(page, textSearch).subscribe(observer);
  }
}
