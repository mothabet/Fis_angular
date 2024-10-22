import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddActivityDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  sectionForm!: FormGroup;
  showLoader: boolean = false;
  sections!: IGetSectorDto[];
  section!: IGetSectorDto;
  sectors!: IGetSectorDto[];
  isUpdate: boolean = false;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder,
  private sectorsAndActivitiesServices: SectorAndActivitiesService) { }

  ngOnInit(): void {
    this.sectionForm = this.formBuilder.group({
      code: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      sectorId: [0, Validators.required],
    });
    this.GetSections(1, '',)
    this.GetSectors(1, '',)
  }
  onSave() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.sectionForm.value.arName == "" || this.sectionForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم القسم بالعربية');
    }
    if (this.sectionForm.value.enName == "" || this.sectionForm.value.enName == null) {
      allErrors.push("Section Name in English is required.");
    }
    if (this.sectionForm.value.code == "" || this.sectionForm.value.code == null) {
      allErrors.push('يجب ادخال رمز القسم');
    }
    else if (this.sectionForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز النشاط مكون من 6');
    }
    if (!(this.sectionForm.value.sectorId > 0)) {
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
      const section: IAddActivityDto = {
        arName: this.sectionForm.value.arName,
        enName: this.sectionForm.value.enName,
        code: this.sectionForm.value.code,
        sectorId: this.sectionForm.value.sectorId,
        categoryId:0
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetSections(1, '');
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
      this.sectorsAndActivitiesServices.AddSection(section).subscribe(observer);
    }
  }
  GetSections(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.sections = res.Data.sectionDto;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else{
          this.sections = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSections(page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetSections(page);
  }
  countriesSearch() {
    this.GetSections(this.currentPage, this.searchText);
  }
  GetSectors(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data.getSectorsDtos;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSectors(0, '').subscribe(observer);
  }
  DeleteSection(id: number): void {
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
            this.GetSections(1, '');
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
        this.sectorsAndActivitiesServices.DeleteSection(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.section = res.Data;
          this.sectionForm.patchValue({
            arName: this.section.arName,
            enName: this.section.enName,
            code: this.section.code,
            sectorId: this.section.sectorId
          });
          this.id = this.section.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSection(id).subscribe(observer);
  }
  updateSection() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.sectionForm.value.arName == "" || this.sectionForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم القسم بالعربية');
    }
    if (this.sectionForm.value.enName == "" || this.sectionForm.value.enName == null) {
      allErrors.push("Section Name in English is required.");
    }
    if (this.sectionForm.value.code == "" || this.sectionForm.value.code == null) {
      allErrors.push('يجب ادخال رمز القسم');
    }
    else if (this.sectionForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز القسم مكون من 6 ارقام');
    }
    if (!(this.sectionForm.value.sectorId > 0)) {
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
        arName: this.sectionForm.value.arName,
        enName: this.sectionForm.value.enName,
        code: this.sectionForm.value.code,
        sectorId: this.sectionForm.value.sectorId,
        categoryId:0
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetSections(1);
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
      this.sectorsAndActivitiesServices.UpdateSection(this.id, Model).subscribe(observer);
    } 
  }
  getControlErrors(controlName: string): string[] {
    debugger
    const control = this.sectionForm.get(controlName);
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
    this.sectionForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code : ['', Validators.required],
      sectorId : 0,
    });    
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}
