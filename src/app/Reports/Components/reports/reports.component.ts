import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IAddReportDto, IGetReportDto } from '../../Dtos/ReportDto';
import { ReportService } from '../../Services/report.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportForm!: FormGroup;
  showLoader: boolean = false;
  reports!: IGetReportDto[];
  report!: IGetReportDto;
  isUpdate: boolean = false;
  id:number=0;
  savedLang: string = '';
  lang:number = 2;
  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private reportServices: ReportService) { }

  ngOnInit(): void {
    this.savedLang = localStorage.getItem('language') || 'ar';
    this.lang = this.savedLang === 'ar' ? 2 : 1;
    this.reportForm = this.fb.group({
      arName: ['fe', Validators.required],
      enName: ['', Validators.required],
      status: ['1', Validators.required]
    });
    this.GetReports(1, '',)
  }

  onSave(): void {
    this.showLoader = true;
    if (this.reportForm.valid) {
      const report: IAddReportDto = {
        arName: this.reportForm.value.arName,
        enName: this.reportForm.value.enName,
        status: true,
      }
      if(this.reportForm.value.status != 1)
        report.status = false;
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.reportForm.reset();
          this.GetReports(1, '');
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
      this.reportServices.AddReport(report).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  GetReports(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.reports = res.Data;
        }
        else
        this.reports=[]
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.reportServices.GetReports(page, textSearch).subscribe(observer);
  }
  onReset(add: number = 0): void {
    this.reportForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      status: ['1', Validators.required]
    });    
    if (add == 1) {
      this.isUpdate = false;
    }
  }
  DeleteReport(id: number): void {
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
            
            this.GetReports(1, '');
            this.showLoader = false;

          },
          error: (err: any) => {
            
            
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.reportServices.DeleteReport(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(reportId: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.report = res.Data;
          this.reportForm.patchValue({
            arName: this.report.arName,
            enName: this.report.enName,
          });
          if (this.report.status == true) {
            this.reportForm.patchValue({
              status: 1,
            });
          }
          else {
            this.reportForm.patchValue({
              status: 2,
            });
          }
          this.id = this.report.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.reportServices.GetReport(reportId).subscribe(observer);
  }
  updateReport() {
    this.showLoader = true;
    if (this.reportForm.valid) {
      const Model: IAddReportDto = {
        arName: this.reportForm.value.arName,
        enName: this.reportForm.value.enName,
        status: true,
      };
      if(this.reportForm.value.status != 1)
        Model.status = false;
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.GetReports(1);
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
      this.reportServices.UpdateReport(this.id, Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
}
