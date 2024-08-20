import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import { IWorkDataChkDto, IWorkDataQuesDto } from 'src/app/Forms/Dtos/WorkDataDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-work-data',
  templateUrl: './shared-work-data.component.html',
  styleUrls: ['./shared-work-data.component.css']
})
export class SharedWorkDataComponent implements OnInit {
  @Input() formId!: string;
  @Input() coverForm!: ICoverFormDetailsDto;
  Loader: boolean = false;
  companyId!: string;
  isWorkDataActive: boolean = false;
  company!: ICompany;
  workData: IWorkDataQuesDto[] = [
    { arName: 'اسم  المنشأة : ', enName: ' :  Name of  Enterprise' , inputValue:''},
    { arName: 'رقم السجل التجارى : ', enName: ' :  Commercial Registration No' , inputValue:''},
    { arName: 'رقم الترخيص البلدي : ', enName: ' :  Municipality Number' , inputValue:''},
    { arName: 'النشاط الاقتصادى الرئيسى : ', enName: ' :  Main Economic Activity' , inputValue:''},
    { arName: 'النشاط الثانوى : ', enName: ' :  Secondary Activity' , inputValue:''},
    { arName: 'عنوان المنشاة : ', enName: ' :  Address and Location' , inputValue:''},
    { arName: 'المنطقة : ', enName: ' :  Region' , inputValue:''},
    { arName: 'الولاية : ', enName: ' :  Wilayat', inputValue:'' },
    { arName: 'رقم صندوق البريد : ', enName: ' :  P.O.Box' , inputValue:''},
    { arName: 'الرمز البريدى : ', enName: ' :  Postal Code' , inputValue:''},
    { arName: 'رقم الهاتف : ', enName: ' :  Telephone No' , inputValue:''},
    { arName: 'رقم الفاكس : ', enName: ' :  Fax No' , inputValue:''},
    { arName: 'البريد الالكترونى : ', enName: ' :  Email' , inputValue:''},
    { arName: 'الموقع الإلكتروني : ', enName: ' :  Website' , inputValue:''},
  ];
  workDataChk: IWorkDataChkDto[] = [
    { arName: 'منشاة فردية', enName: 'Sole Proprietorship', selected: false },
    { arName: 'تضامنية', enName: 'Simple Partnership', selected: false },
    { arName: 'توصية', enName: 'Limited Partnership', selected: false },
    { arName: 'محاصة', enName: 'Shared Limited Partnership', selected: false },
    { arName: 'مساهمة ( عامه او مقفله )', enName: 'Joint Stock (Public or closed)', selected: false },
    { arName: 'محدودة المسؤولية', enName: 'Limited Liability', selected: false },
    { arName: 'فرع شركة اجنبية', enName: 'Branch of Foreign Enterprise', selected: false },
    { arName: 'أخرى (حدد)', enName: 'Other (specify)', selected: false }
  ];
  constructor(private companyServices: CompanyHomeService, private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetFormById(+this.formId)
    this.isWorkDataActive = true;
    if (+this.companyId != null || +this.companyId != 0)
    {
      this.GetCompanyById(+this.companyId);
      
    }
  }
  GetCompanyById(id: number) {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.company = res.Data;
          this.workData.forEach((item) => {
            if (item.arName.includes('اسم  المنشأة : ')) {
              item.inputValue = this.company.arName;
            }
            else if (item.arName.includes('الموقع الإلكتروني : ')) {
              
              item.inputValue = this.company.webSite;
            }
            else if (item.arName.includes('رقم الفاكس : ')) {
              
              item.inputValue = this.company.fax;
            }
            else if (item.arName.includes('البريد الالكترونى : ')) {
              
              item.inputValue = this.company.email;
            }
            else if (item.arName.includes('رقم الهاتف : ')) {
              
              item.inputValue = this.company.phoneNumber;
            }
            else if (item.arName.includes('الرمز البريدى : ')) {
              
              item.inputValue = this.company.postalCode;
            }
            else if (item.arName.includes('رقم صندوق البريد : ')) {
              
              item.inputValue = this.company.mailBox;
            }
            else if (item.arName.includes('الولاية : ')) {
              
              item.inputValue = this.company.wilayat;
            }
            else if (item.arName.includes('المنطقة : ')) {
              
              item.inputValue = this.company.governorates;
            }
            else if (item.arName.includes('عنوان المنشاة : ')) {
              
              item.inputValue = this.company.address;
            }
            else if (item.arName.includes('النشاط الثانوى : ')) {
              
              item.inputValue = this.company.subActivity;
            }
            else if (item.arName.includes('النشاط الاقتصادى الرئيسى : ')) {
              
              item.inputValue = this.company.activity;
            }
            else if (item.arName.includes('رقم الترخيص البلدي : ')) {
              
              item.inputValue = this.company.compRegNumber;
            }
            else if (item.arName.includes('رقم السجل التجارى : ')) {
              
              item.inputValue = this.company.compRegNumber;
            }
          });
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.companyServices.GetCompanyById(id).subscribe(observer);
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.coverForm = res.Data;
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  onCheckboxChange(selectedIndex: number): void {
    this.workDataChk.forEach((item, index) => {
      item.selected = index === selectedIndex;
    });
  }

}
