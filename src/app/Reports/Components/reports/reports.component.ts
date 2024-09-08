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
  reports!:IGetReportDto[];
  constructor(    private sharedService: SharedService,private fb: FormBuilder,
    private toastr: ToastrService,private reportServices:ReportService) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      status: ['1', Validators.required]
    });
    this.GetReports(1,'',)
  }

  onSave(): void {
    this.showLoader = true;
    if (this.reportForm.valid) {
      const report : IAddReportDto = {
        arName : this.reportForm.value.arName,
        enName : this.reportForm.value.enName,
        status : true,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.reportForm.reset();
          this.GetReports(1,'');
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
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.reportServices.GetReports(page, textSearch).subscribe(observer);
  }
  onReset(): void {
    this.reportForm.reset();
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
      debugger
      if (result.isConfirmed) {
        this.showLoader = true;
        const observer = {
          next: (res: any) => {
            debugger
            this.GetReports(1,'');
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
}
