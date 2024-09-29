import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddActivityDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activityForm!: FormGroup;
  showLoader: boolean = false;
  activities!: IGetSectorDto[];
  activity!: IGetSectorDto;
  sectors!: IGetSectorDto[];
  isUpdate: boolean = false;
  id: number = 0;
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder,

    private toastr: ToastrService, private sectorsAndActivitiesServices: SectorAndActivitiesService) { }

  ngOnInit(): void {
    this.activityForm = this.formBuilder.group({
      code: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      sectorId: [0, Validators.required],
    });
    this.GetActivities(1, '',)
    this.GetSectors(1, '',)
  }
  onSave() {
    debugger
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.activityForm.value.arName == "" || this.activityForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم النشاط بالعربية');
    }
    if (this.activityForm.value.enName == "" || this.activityForm.value.enName == null) {
      allErrors.push("Activity Name in English is required.");
    }
    if (this.activityForm.value.code == "" || this.activityForm.value.code == null) {
      allErrors.push('يجب ادخال رمز النشاط');
    }
    if (!(this.activityForm.value.sectorId > 0)) {
      allErrors.push('يجب اختيار اسم القطاع');
    }
    if (allErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      this.showLoader = false;
    }
    else {
      const activity: IAddActivityDto = {
        arName: this.activityForm.value.arName,
        enName: this.activityForm.value.enName,
        code: this.activityForm.value.code,
        sectorId: this.activityForm.value.sectorId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetActivities(1, '');
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.AddActivity(activity).subscribe(observer);
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
  GetSectors(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data;
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
  DeleteActivity(id: number): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا'
    }).then((result) => {
      debugger
      if (result.isConfirmed) {
        this.showLoader = true;
        const observer = {
          next: (res: any) => {
            this.GetActivities(1, '');
            this.showLoader = false;
            Swal.fire({
              icon: 'success',
              title: res.Message,
              showConfirmButton: true,
              confirmButtonText: 'اغلاق'
            });
          },
          error: (err: any) => {
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.sectorsAndActivitiesServices.DeleteActivity(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activity = res.Data;
          this.activityForm.patchValue({
            arName: this.activity.arName,
            enName: this.activity.enName,
            code: this.activity.code,
            sectorId: this.activity.sectorId
          });
          this.id = this.activity.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetActivity(id).subscribe(observer);
  }
  updateActivity() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.activityForm.value.arName == "" || this.activityForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم النشاط بالعربية');
    }
    if (this.activityForm.value.enName == "" || this.activityForm.value.enName == null) {
      allErrors.push("Activity Name in English is required.");
    }
    if (this.activityForm.value.code == "" || this.activityForm.value.code == null) {
      allErrors.push('يجب ادخال رمز النشاط');
    }
    if (!(this.activityForm.value.sectorId > 0)) {
      allErrors.push('يجب اختيار اسم القطاع');
    }
    if (allErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      this.showLoader = false;
    }
    else {
      const Model: IAddActivityDto = {
        arName: this.activityForm.value.arName,
        enName: this.activityForm.value.enName,
        code: this.activityForm.value.code,
        sectorId: this.activityForm.value.sectorId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetActivities(1);
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.UpdateActivity(this.id, Model).subscribe(observer);
    } 
  }
  getControlErrors(controlName: string): string[] {
    debugger
    const control = this.activityForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'arName') controlName = 'اسم النشاط بالعربية';
      if (controlName == 'enName') controlName = 'Activity Name in English';
      if (controlName == 'code') controlName = 'رمز النشاط';
      if (controlName == 'sectorId') controlName = 'اسم القطاع';
      if (controlName == 'اسم القطاع' && control.errors['required']) {
        errors.push(`يجب اختيار ${controlName}`);
      }
      else if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
    }
    return errors;
  }
  onReset(): void {
    this.isUpdate = false;
    this.activityForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code : ['', Validators.required],
      sectorId : 0,
    });    
  }
}
