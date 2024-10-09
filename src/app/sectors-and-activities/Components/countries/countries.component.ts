import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCountryDto, IAddSectorDto, IGetCountryDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import { SharedService } from 'src/app/shared/services/shared.service';
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
  countries!:IGetCountryDto[];
  country!:IAddCountryDto;
  getcountry!:IGetCountryDto;
  isUpdate: boolean = false;
  id:number=0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  constructor(private sharedService: SharedService,private fb: FormBuilder,
    private sectorsAndActivitiesServices:SectorAndActivitiesService) {}

  ngOnInit(): void {
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      countryPhone:['',Validators.required]
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
    if (this.countryForm.value.countryPhone == "" || this.countryForm.value.countryPhone == null) {
      allErrors.push('يجب ادخال رقم الدولة');
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
      const country : IAddCountryDto = {
        arName : this.countryForm.value.arName,
        enName : this.countryForm.value.enName,
        code : this.countryForm.value.code,
        countryPhone : this.countryForm.value.countryPhone,
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
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.countries = res.Data.getCountryDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else{
          this.countries = [];
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
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetCountries(page);
  }
  countriesSearch() {
    this.GetCountries(this.currentPage, this.searchText);
  }
  onReset(): void {
    this.isUpdate = false;
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      countryPhone:['',Validators.required]
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
          this.getcountry = res.Data;
          this.countryForm.patchValue({
            arName: this.getcountry.arName,
            enName: this.getcountry.enName,
            code: this.getcountry.code,
            countryPhone:this.getcountry.countryPhone
          });
          this.id = this.getcountry.id;
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
    if (this.countryForm.value.countryPhone == "" || this.countryForm.value.countryPhone == null) {
      allErrors.push('يجب ادخال رقم الدولة');
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
      const Model: IAddCountryDto = {
        arName: this.countryForm.value.arName,
        enName: this.countryForm.value.enName,
        code: this.countryForm.value.code,
        countryPhone: this.countryForm.value.countryPhone,
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
