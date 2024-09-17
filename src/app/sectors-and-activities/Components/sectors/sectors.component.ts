import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IGetReportDto } from 'src/app/Reports/Dtos/ReportDto';
import { ReportService } from 'src/app/Reports/Services/report.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddSectorDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {
  sectorForm!: FormGroup;
  showLoader: boolean = false;
  sectors!:IGetSectorDto[];
  sector!:IGetSectorDto;
  isUpdate: boolean = false;
  id:number=0;
  constructor(    private sharedService: SharedService,private fb: FormBuilder,
    private toastr: ToastrService,private sectorsAndActivitiesServices:SectorAndActivitiesService) {}

  ngOnInit(): void {
    this.sectorForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required]
    });
    this.GetSectors(1,'',)
  }
  onSave(): void {
    this.showLoader = true;
    if (this.sectorForm.valid) {
      const sector : IAddSectorDto = {
        arName : this.sectorForm.value.arName,
        enName : this.sectorForm.value.enName,
        code : this.sectorForm.value.code,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.sectorForm.reset();
          this.GetSectors(1,'');
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
      this.sectorsAndActivitiesServices.AddSector(sector).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  GetSectors(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data;
          console.log(this.sectors)
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
  onReset(add: number = 0): void {
    this.sectorForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required]
    });    
    if (add == 1) {
      this.isUpdate = false;
    }
  }
  DeleteSector(id: number): void {
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
            this.GetSectors(1,'');
            this.showLoader = false;
            
          },
          error: (err: any) => {
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.sectorsAndActivitiesServices.DeleteSector(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sector = res.Data;
          this.sectorForm.patchValue({
            arName: this.sector.arName,
            enName: this.sector.enName,
            code: this.sector.code,
          });
          this.id = this.sector.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSector(id).subscribe(observer);
  }
  updateCountry() {
    this.showLoader = true;
    if (this.sectorForm.valid) {
      const Model: IAddSectorDto = {
        arName: this.sectorForm.value.arName,
        enName: this.sectorForm.value.enName,
        code: this.sectorForm.value.code,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.GetSectors(1);
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
      this.sectorsAndActivitiesServices.UpdateSector(this.id, Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
}