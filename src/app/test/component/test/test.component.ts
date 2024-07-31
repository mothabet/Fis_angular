import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddForm, IGetFormDto } from 'src/app/Forms/Dtos/FormDto';
import { TestService } from '../../services/test.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddTableDto, IGetTableDto } from 'src/app/Forms/Dtos/TableDto';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  formForm!: FormGroup;
  tableForm!: FormGroup;
  showLoader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  addForm!: IAddForm;
  tables: IGetTableDto[] = [];
  addTable!: IAddTableDto;
  add: boolean = true;
  addTableBtn: boolean = true;
  id: number = 0;
  idTable: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private testService: TestService,
    private sharedService: SharedService
  ) { }
  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arNotes: ['', Validators.required],
      enNotes: ['', Validators.required],
      IsActive: ['', Validators.required],
      Type: ['', Validators.required],
    });
    this.tableForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arNotes: ['', Validators.required],
      enNotes: ['', Validators.required],
      IsActive: ['', Validators.required],
      Type: ['', Validators.required],
    });
    this.GetAllForms();
  }

  saveForm() {
    this.showLoader = true;
    debugger
    if (this.formForm.valid) {
      const Model: IAddForm = {
        arName: this.formForm.value.arName,
        enName: this.formForm.value.enName,
        arNotes: this.formForm.value.arNotes,
        enNotes: this.formForm.value.enNotes,
        IsActive: this.formForm.value.IsActive, // Corrected to match the interface
        Type: this.formForm.value.Type
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllForms();
          console.log(res)
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
      this.testService.AddForm(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  resetForm(): void {
    this.formForm.reset({
      arName: '',
      enName: '',
      arNotes: '',
      enNotes: '',
      IsActive: '',
      Type: '',
    });
  }
  GetAllForms(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          console.log(res.Data)
          this.forms = res.Data;
          this.resetForm();
        }
        else {

        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.GetAllForms().subscribe(observer);
  }
  showAlert(id: number): void {
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
        this.DeleteForm(id);
      }
    });
  }
  DeleteForm(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllForms();
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.DeleteForm(id).subscribe(observer);
  }
  editForm(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.addForm = res.Data;
          this.formForm.patchValue({
            arName: this.addForm.arName,
            enName: this.addForm.enName,
            arNotes: this.addForm.arNotes,
            enNotes: this.addForm.enNotes,
            IsActive: this.addForm.IsActive,
            Type: this.addForm.Type,
          });
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addFormBtn');
          if (button) {
            button.click();
          }
          this.id = id;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.GetFormById(id).subscribe(observer);
  }
  updateForm() {
    this.showLoader = true;
    if (this.formForm.valid) {
      const Model: IAddForm = {
        arName: this.formForm.value.arName,
        enName: this.formForm.value.enName,
        arNotes: this.formForm.value.arNotes,
        enNotes: this.formForm.value.enNotes,
        IsActive: this.formForm.value.IsActive,
        Type: this.formForm.value.userName,
      };
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllForms();
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          debugger
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.testService.UpdateForm(this.id, Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  saveTable() {
    this.showLoader = true;
    debugger
    if (this.tableForm.valid) {
      const Model: IAddTableDto = {
        arName: this.tableForm.value.arName,
        enName: this.tableForm.value.enName,
        arHeading: this.tableForm.value.arHeading,
        enHeading: this.tableForm.value.enHeading,
        Type: this.tableForm.value.Type,
        fromId: this.tableForm.value.fromId,
        isActive: this.tableForm.value.isActive,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetTable();
          this.GetAllTables();
          console.log(res)
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
      this.testService.AddTable(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  resetTable(): void {
    this.formForm.reset({
      arName: '',
      enName: '',
      arHeading: '',
      enHeading: '',
      Type: '',
      fromId: '',
      isActive: '',
    });
  }
  GetAllTables(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.tables = res.Data;
          this.resetForm();
        }
        else {

        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.GetAllTables().subscribe(observer);
  }
  showAlertTable(id: number): void {
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
        this.DeleteTable(id);
      }
    });
  }
  DeleteTable(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllTables();
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.DeleteTable(id).subscribe(observer);
  }
  editTable(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.addTable = res.Data;
          this.formForm.patchValue({
            arName: this.addTable.arName,
            enName: this.addTable.enName,
            arHeading: this.addTable.arHeading,
            enHeading: this.addTable.enHeading,
            Type: this.addTable.Type,
            fromId: this.addTable.fromId,
            isActive: this.addTable.isActive,
          });
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addFormBtn');
          if (button) {
            button.click();
          }
          this.idTable = id;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.testService.GetTableById(id).subscribe(observer);
  }
  updateTable() {
    this.showLoader = true;
    if (this.formForm.valid) {
      const Model: IAddTableDto = {
        arName: this.formForm.value.arName,
            enName: this.formForm.value.enName,
            arHeading: this.formForm.value.arHeading,
            enHeading: this.formForm.value.enHeading,
            Type: this.formForm.value.Type,
            fromId: this.formForm.value.fromId,
            isActive: this.formForm.value.isActive,
      };
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllForms();
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          debugger
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.testService.UpdateTable(this.id, Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
}
