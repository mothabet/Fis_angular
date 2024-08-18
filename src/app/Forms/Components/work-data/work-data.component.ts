import { Component, OnInit } from '@angular/core';
import { ICoverFormDetailsDto } from '../../Dtos/FormDto';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormService } from '../../Services/form.service';
import { IWorkDataChkDto, IWorkDataQuesDto } from '../../Dtos/WorkDataDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-work-data',
  templateUrl: './work-data.component.html',
  styleUrls: ['./work-data.component.css']
})
export class WorkDataComponent implements OnInit{
  coverForm!: ICoverFormDetailsDto;
  Loader: boolean = false;
  formId: string = '';
  isWorkDataActive:boolean = false;
  workData: IWorkDataQuesDto[] = [
    { arName: 'اسم  المنشأة : ', enName: ' :  Name of  Enterprise' },
    { arName: 'رقم السجل التجارى : ', enName: ' :  Commercial Registration No' },
    { arName: 'رقم الترخيص البلدي : ', enName: ' :  Municipality Number' },
    { arName: 'النشاط الاقتصادى الرئيسى : ', enName: ' :  Main Economic Activity' },
    { arName: 'النشاط الثانوى : ', enName: ' :  Secondary Activity' },
    { arName: 'عنوان المنشاة : ', enName: ' :  Address and Location' },
    { arName: 'المنطقة : ', enName: ' :  Region' },
    { arName: 'الولاية : ', enName: ' :  Wilayat' },
    { arName: 'رقم صندوق البريد : ', enName: ' :  P.O.Box' },
    { arName: 'الرمز البريدى : ', enName: ' :  Postal Code' },
    { arName: 'رقم الهاتف : ', enName: ' :  Telephone No' },
    { arName: 'رقم الفاكس : ', enName: ' :  Fax No' },
    { arName: 'البريد الالكترونى : ', enName: ' :  Email' },
    { arName: 'الموقع الإلكتروني : ', enName: ' :  Website' },
  ];
  workDataChk: IWorkDataChkDto[] = [
    { arName: 'منشاة فردية', enName: 'Sole Proprietorship',selected : false},
    { arName: 'تضامنية', enName: 'Simple Partnership',selected : false},
    { arName: 'توصية', enName: 'Limited Partnership',selected : false},
    { arName: 'محاصة', enName: 'Shared Limited Partnership',selected : false},
    { arName: 'مساهمة ( عامه او مقفله )', enName: 'Joint Stock (Public or closed)',selected : false},
    { arName: 'محدودة المسؤولية', enName: 'Limited Liability',selected : false},
    { arName: 'فرع شركة اجنبية', enName: 'Branch of Foreign Enterprise',selected : false},
    { arName: 'أخرى (حدد)', enName: 'Other (specify)',selected : false}
  ];
  role:string = "";

  constructor(private authService: LoginService,private formServices: FormService,private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.GetFormById(+this.formId);
    this.isWorkDataActive = true;
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
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
    this.formServices.GetFormById(id).subscribe(observer);
  }
  onCheckboxChange(selectedIndex: number): void {
    this.workDataChk.forEach((item, index) => {
      item.selected = index === selectedIndex;
    });
  }
}
