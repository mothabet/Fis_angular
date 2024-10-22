import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddActivityDto, IAddCategory, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  showLoader: boolean = false;
  categories!: IGetSectorDto[];
  category!: IGetSectorDto;
  groups!: IGetSectorDto[];
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
    this.categoryForm = this.formBuilder.group({
      code: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      groupId: [0, Validators.required],
    });
    this.GetCategories(1, '',)
    this.GetGroups(1, '',)
  }
  onSave() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.categoryForm.value.arName == "" || this.categoryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الفئة بالعربية');
    }
    if (this.categoryForm.value.enName == "" || this.categoryForm.value.enName == null) {
      allErrors.push("Category Name in English is required.");
    }
    if (this.categoryForm.value.code == "" || this.categoryForm.value.code == null) {
      allErrors.push('يجب اختيار الفئة');
    }
    else if (this.categoryForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز الفئة مكون من 6');
    }
    if (!(this.categoryForm.value.groupId > 0)) {
      allErrors.push('يجب اختيار اسم المجموعة');
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
      const category: IAddCategory = {
        arName: this.categoryForm.value.arName,
        enName: this.categoryForm.value.enName,
        code: this.categoryForm.value.code,
        groupId: this.categoryForm.value.groupId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCategories(1, '');
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
      this.sectorsAndActivitiesServices.AddCategory(category).subscribe(observer);
    }
  }
  GetCategories(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.categories = res.Data.categoryDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else{
          this.categories = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCategories(page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetCategories(page);
  }
  countriesSearch() {
    this.GetCategories(this.currentPage, this.searchText);
  }
  GetGroups(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.groups = res.Data.GroupDtos;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetGroups(0, '').subscribe(observer);
  }
  DeleteCategory(id: number): void {
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
            this.GetCategories(1, '');
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
        this.sectorsAndActivitiesServices.DeleteCategory(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.category = res.Data;
          this.categoryForm.patchValue({
            arName: this.category.arName,
            enName: this.category.enName,
            code: this.category.code,
            groupId: res.Data.groupId
          });
          this.id = this.category.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCategory(id).subscribe(observer);
  }
  updateCategory() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.categoryForm.value.arName == "" || this.categoryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الفئة بالعربية');
    }
    if (this.categoryForm.value.enName == "" || this.categoryForm.value.enName == null) {
      allErrors.push("Category Name in English is required.");
    }
    if (this.categoryForm.value.code == "" || this.categoryForm.value.code == null) {
      allErrors.push('يجب اختيار الفئة');
    }
    else if (this.categoryForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز الفئة مكون من 6 ارقام');
    }
    if (!(this.categoryForm.value.groupId > 0)) {
      allErrors.push('يجب اختيار اسم المجموعة');
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
      const Model: IAddCategory = {
        arName: this.categoryForm.value.arName,
        enName: this.categoryForm.value.enName,
        code: this.categoryForm.value.code,
        groupId: this.categoryForm.value.groupId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCategories(1);
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
      this.sectorsAndActivitiesServices.UpdateCategory(this.id, Model).subscribe(observer);
    } 
  }
  getControlErrors(controlName: string): string[] {
    const control = this.categoryForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'arName') controlName = 'اسم الفئة بالعربية';
      if (controlName == 'enName') controlName = 'Category Name in English';
      if (controlName == 'code') controlName = 'رمز الفئة';
      if (controlName == 'groupId') controlName = 'اسم المجموعة';
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
    this.categoryForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code : ['', Validators.required],
      groupId : 0,
    });    
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}
