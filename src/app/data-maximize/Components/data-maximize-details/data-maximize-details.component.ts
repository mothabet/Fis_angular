import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MaximizeService } from '../../Services/maximize.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-data-maximize-details',
  templateUrl: './data-maximize-details.component.html',
  styleUrls: ['./data-maximize-details.component.css']
})
export class DataMaximizeDetailsComponent implements OnInit {
  showLoader: boolean = false;
  noData: boolean = false;
  id: number = 0;
  type: number = 0;
  dataMaximizeDetails: any = {
    dataMazimizeYearDtos: [
      {
        dataMaximizeDetailsItemsDtos: {
          sectorName: "",
          totalBefore: 0,
          totalAfter: 0
        }
      }
    ]
  };
  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private dataMaximizeServices: MaximizeService,
    private activeRouter: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.id = +this.activeRouter.snapshot.paramMap.get('id')!;
    this.GetDataMaximizeDetails(1);
  }
  GetDataMaximizeDetails(type: number): void {
    this.showLoader = true;
    this.type = type;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {

          if (res.Data.dataMazimizeYearDtos[0].dataMaximizeDetailsItemsDtos && res.Data.dataMazimizeYearDtos[1].dataMaximizeDetailsItemsDtos) {
            this.dataMaximizeDetails = res.Data;
            this.noData = false;
          }
          else {
            this.dataMaximizeDetails = res.Data;
            this.noData = true;
          }
        }
        else {
          this.noData = true
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.dataMaximizeServices.GetDataMaximizeDetails(this.id, type).subscribe(observer);
  }
  printExcel() {
    // تحضير ملف العمل وأسماء التابات
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
  
    // اسماء التابات بناءً على `reviewYear`
    const reviewYear = this.dataMaximizeDetails.reviewYear;
    const tabNames = [(reviewYear - 1).toString(),reviewYear.toString()];
  
    // إنشاء الصفحات بناءً على البيانات
    this.dataMaximizeDetails.dataMazimizeYearDtos.forEach((dataDto: any, index: number) => {
      const sheetName = `Data_Maximize_${tabNames[index]}`; // اسم التاب بناءً على السنة
      const formattedData = this.formatTabData(dataDto.dataMaximizeDetailsItemsDtos, this.type); // تهيئة البيانات
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
      // إضافة الأنماط للعناوين
      const headers = Object.keys(formattedData[0] || {}); // رؤوس الجدول
      headers.forEach((header, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        worksheet[cellAddress] = worksheet[cellAddress] || { t: 's', v: header };
        worksheet[cellAddress].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center" }
        };
      });
  
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = worksheet;
    });
  
    // اسم الملف بناءً على `reviewYear`
    const fileName = `Data_Maximize_${reviewYear}`;
    
    // كتابة وتحميل الملف
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  formatTabData(items: any[], type: number): any[] {
    // تهيئة البيانات بناءً على النوع
    return items.map(item => {
      switch (type) {
        case 1: // القطاع
          return {
            'كود القطاع': item.sectorCode || '',
            'اسم القطاع': item.sectorName || '',
            'إجمالي قبل التكبير': item.totalBefore || 0,
            'إجمالي بعد التكبير': item.totalAfter || 0
          };
        case 2: // الشركة
          return {
            'اسم الشركة': item.sectorName || '',
            'إجمالي قبل التكبير': item.totalBefore || 0,
            'إجمالي بعد التكبير': item.totalAfter || 0
          };
        case 3: // النشاط
          return {
            'كود النشاط': item.sectorCode || '',
            'اسم النشاط': item.sectorName || '',
            'إجمالي قبل التكبير': item.totalBefore || 0,
            'إجمالي بعد التكبير': item.totalAfter || 0
          };
        default:
          return {};
      }
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}