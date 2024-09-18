import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddSectorDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  countryForm!: FormGroup;
  showLoader: boolean = false;
  countries!:IGetSectorDto[];
  country!:IGetSectorDto;
  isUpdate: boolean = false;
  id:number=0;
  constructor(    private sharedService: SharedService,private fb: FormBuilder,
    private toastr: ToastrService,private sectorsAndActivitiesServices:SectorAndActivitiesService) {}

  ngOnInit(): void {
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required]
    });
    this.GetCountries(1,'',)
  }
  onSave(): void {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.countryForm.value.arName == "" || this.countryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الدوله بالعربية');
    }
    if (this.countryForm.value.enName == "" || this.countryForm.value.enName == null) {
      allErrors.push("Country Name in English is required.");
    }
    if (this.countryForm.value.code == "" || this.countryForm.value.code == null) {
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
      const country : IAddSectorDto = {
        arName : this.countryForm.value.arName,
        enName : this.countryForm.value.enName,
        code : this.countryForm.value.code,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCountries(1,'');
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
      this.sectorsAndActivitiesServices.AddCountry(country).subscribe(observer);
    } 
  }
  GetCountries(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.countries = res.Data;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCountries(page, textSearch).subscribe(observer);
  }
  onReset(): void {
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: [0, Validators.required]
    });
  }
  DeleteCountry(id: number): void {
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
            this.GetCountries(1,'');
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
        this.sectorsAndActivitiesServices.DeleteCountry(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.country = res.Data;
          this.countryForm.patchValue({
            arName: this.country.arName,
            enName: this.country.enName,
            code: this.country.code,
          });
          this.id = this.country.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCountry(id).subscribe(observer);
  }
  updateCountry() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.countryForm.value.arName == "" || this.countryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الدوله بالعربية');
    }
    if (this.countryForm.value.enName == "" || this.countryForm.value.enName == null) {
      allErrors.push("Country Name in English is required.");
    }
    if (this.countryForm.value.code == "" || this.countryForm.value.code == null) {
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
      const Model: IAddSectorDto = {
        arName: this.countryForm.value.arName,
        enName: this.countryForm.value.enName,
        code: this.countryForm.value.code,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCountries(1);
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
      this.sectorsAndActivitiesServices.UpdateCountry(this.id, Model).subscribe(observer);
    }
  }
}
