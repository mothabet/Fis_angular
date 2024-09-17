import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { IAddActivityDto, IAddSubActivityDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-activities',
  templateUrl: './sub-activities.component.html',
  styleUrls: ['./sub-activities.component.css']
})
export class SubActivitiesComponent implements OnInit {
  subActivityForm!: FormGroup;
  showLoader: boolean = false;
  activities!:IGetSectorDto[];
  subActivities!:IGetSectorDto[];
  subActivity!:IGetSectorDto;
  isUpdate: boolean = false;
  id:number=0;
  constructor(    private sharedService: SharedService,private fb: FormBuilder,
    private toastr: ToastrService,private sectorsAndActivitiesServices:SectorAndActivitiesService) {}

  ngOnInit(): void {
    this.subActivityForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      activityId : ['', Validators.required],
    });
    this.GetSubActivities(1,'',)
    this.GetActivities(1,'',)
  }
  onSave(): void {
    this.showLoader = true;
    if (this.subActivityForm.valid) {
      const subActivity : IAddSubActivityDto = {
        arName : this.subActivityForm.value.arName,
        enName : this.subActivityForm.value.enName,
        code : this.subActivityForm.value.code,
        activityId : this.subActivityForm.value.activityId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.subActivityForm.reset();
          this.GetSubActivities(1,'');
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
      this.sectorsAndActivitiesServices.AddSubActivity(subActivity).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  GetSubActivities(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.subActivities = res.Data;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSubActivities(page, textSearch).subscribe(observer);
  }
  onReset(add: number = 0): void {
    this.subActivityForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      activityId:this.activities[0].id
    });    
    if (add == 1) {
      this.isUpdate = false;
    }
  }
  GetActivities(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data;
          this.subActivityForm.patchValue({ activityId: this.activities[0].id });
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
  DeleteSubActivity(id: number): void {
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
      if (result.isConfirmed) {
        this.showLoader = true;
        const observer = {
          next: (res: any) => {
            this.GetSubActivities(1,'');
            this.showLoader = false;
            
          },
          error: (err: any) => {
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.sectorsAndActivitiesServices.DeleteSubActivity(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.subActivity = res.Data;
          this.subActivityForm.patchValue({
            arName: this.subActivity.arName,
            enName: this.subActivity.enName,
            code: this.subActivity.code,
            activityId : this.subActivity.activityId
          });
          this.id = this.subActivity.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSubActivity(id).subscribe(observer);
  }
  updateSubActivity() {
    this.showLoader = true;
    if (this.subActivityForm.valid) {
      const Model: IAddSubActivityDto = {
        arName: this.subActivityForm.value.arName,
        enName: this.subActivityForm.value.enName,
        code: this.subActivityForm.value.code,
        activityId : this.subActivityForm.value.activityId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.GetSubActivities(1);
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
      this.sectorsAndActivitiesServices.UpdateSubActivity(this.id, Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
}