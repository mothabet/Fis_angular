import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
    const allErrors: string[] = [];
    if (this.sectorForm.value.arName == "" || this.sectorForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الدوله بالعربية');
    }
    if (this.sectorForm.value.enName == "" || this.sectorForm.value.enName == null) {
      allErrors.push("Country Name in English is required.");
    }
    if (this.sectorForm.value.code == "" || this.sectorForm.value.code == null) {
      allErrors.push('يجب ادخال رمز الدولة');
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
  onReset(): void {
    this.isUpdate = false;
    this.sectorForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required]
    });
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
    const allErrors: string[] = [];
    if (this.sectorForm.value.arName == "" || this.sectorForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم القطاع بالعربية');
    }
    if (this.sectorForm.value.enName == "" || this.sectorForm.value.enName == null) {
      allErrors.push("Sector Name in English is required.");
    }
    if (this.sectorForm.value.code == "" || this.sectorForm.value.code == null) {
      allErrors.push('يجب ادخال رمز القطاع');
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
          this.onReset();
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
    }
  }
}
