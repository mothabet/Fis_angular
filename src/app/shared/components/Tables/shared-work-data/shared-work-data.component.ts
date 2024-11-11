import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICertificationDto, ICoverFormDetailsDto, IQuarterCoverFormDataDto } from 'src/app/Forms/Dtos/FormDto';
import { IGeneralDataDto, IWorkDataChkDto, IWorkDataQuesDto } from 'src/app/Forms/Dtos/WorkDataDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ICoverFormData } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-work-data',
  templateUrl: './shared-work-data.component.html',
  styleUrls: ['./shared-work-data.component.css']
})
export class SharedWorkDataComponent implements OnInit {
  @Input() formId!: string;
  coverForm: ICoverFormDetailsDto = {
    id: 0,
    typeQuarter: 0,
    tables: [],
    arName: '',
    enName: '',
    arNotes: '',
    enNotes: '',
    reviewYear: '',
    status: 0,
    quarterCoverData: {} as IQuarterCoverFormDataDto,  // Initialize with an empty object or default values
    coverFormData: {} as ICoverFormData,              // Same here
    certification: {} as ICertificationDto,           // And here
    codeActivity: '',
    codeSectorName: '',
    GeneralData: {} as IGeneralDataDto,               // Initialize GeneralData
    Type: 0
  };
  Loader: boolean = false;
  companyId!: string;
  isWorkDataActive: boolean = false;
  company!: ICompany;
  workData: IWorkDataQuesDto[] = [
    { arName: 'اسم  المنشأة : ', enName: ' :  Name of  Enterprise', inputValue: '' , isSelect:false},
    { arName: 'رقم السجل التجارى : ', enName: ' :  Commercial Registration No',inputValue: '' , isSelect:false},
    { arName: 'رقم الترخيص البلدي : ', enName: ' :  Municipality Number',inputValue: '' , isSelect:false},
    { arName: 'النشاط الاقتصادى الرئيسى : ', enName: ' :  Main Economic Activity',inputValue: '' , isSelect:false},
    { arName: 'النشاط الثانوى : ', enName: ' :  Secondary Activity',inputValue: '' , isSelect:false},
    { arName: 'عنوان المنشاة : ', enName: ' :  Address and Location',inputValue: '' , isSelect:false},
    { arName: 'المحافظة : ', enName: ' :  Region',inputValue: '0' , isSelect:true},
    { arName: 'الولاية : ', enName: ' :  Wilayat',inputValue: '0' , isSelect:true},
    { arName: 'رقم صندوق البريد : ', enName: ' :  P.O.Box',inputValue: '' , isSelect:false},
    { arName: 'الرمز البريدى : ', enName: ' :  Postal Code',inputValue: '' , isSelect:false},
    { arName: 'رقم الهاتف : ', enName: ' :  Telephone No',inputValue: '' , isSelect:false},
    { arName: 'رقم الفاكس : ', enName: ' :  Fax No',inputValue: '' , isSelect:false},
    { arName: 'البريد الالكترونى : ', enName: ' :  Email',inputValue: '' , isSelect:false},
    { arName: 'الموقع الإلكتروني : ', enName: ' :  Website',inputValue: '' , isSelect:false},
    { arName: 'الكيان القانونى للمنشأة ( يرجى وضع اشارة صح على حالةالمنشأة) : ', enName: ' :  The Legal Type of Organization (tick approprate reponse)',inputValue: '' , isSelect:false},

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
  generalDataDto: IGeneralDataDto = {
    ChekInfo: 0,
    CompanyInfo: this.workData,
    from: '',
    to: '',
    describeMainActivity: '',
    dataSource: 0
  };
  Governorates: IDropdownList[] = []
  Wilayat: IDropdownList[] = []

  constructor(private authService: LoginService, private companyServices: CompanyHomeService, private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetFormById(+this.formId)
    this.isWorkDataActive = true;
    this.GetGovernorates();
  }
  GetGovernorates() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Governorates = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.companyServices.GetGovernorates().subscribe(observer);
  }
  GetWilayat(govId: number) {
    if (govId > 0) {
      const observer = {
        next: (res: any) => {
          
          if (res.Data) {
            this.Wilayat = res.Data;
          }
          const checkWilaya = this.Wilayat.find(r=>r.id == +this.workData[7].inputValue);
          if(!checkWilaya){
            this.workData[7].inputValue = '0';
          }
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
        },
      };
      this.companyServices.GetWilayat(govId).subscribe(observer);
    }
  }
  onDataSourceCheckboxChange(value: number) {
    this.coverForm.GeneralData.dataSource = value; // Set the selected value
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
            else if (item.arName.includes("الكيان القانونى للمنشأة ( يرجى وضع اشارة صح على حالةالمنشأة) : ")) {

              item.inputValue = this.company.legalType;
              item.isSelect = true;
            }
            else if (item.arName.includes('الموقع الإلكتروني : ')) {

              item.inputValue = this.company.webSite;
            }
            else if (item.arName.includes('رقم الفاكس : ')) {

              item.inputValue = this.company.fax;
            }
            else if (item.arName.includes('البريد الالكترونى : ')) {

              item.inputValue = this.company.companyEmails[0].Email;
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
              item.inputValue = this.company.wilayatId.toString();
              item.isSelect = true;

            }
            else if (item.arName.includes('المحافظة : ')) {

              item.inputValue = this.company.governoratesId.toString();
              item.isSelect = true;
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
          
          let generalData = localStorage.getItem(`generalData`);
          if (generalData) {
            this.coverForm.GeneralData = JSON.parse(generalData) as IGeneralDataDto;
            this.workData = this.coverForm.GeneralData.CompanyInfo;
          }
          else {
            this.coverForm.GeneralData = this.generalDataDto;
            this.coverForm.GeneralData.CompanyInfo = this.workData as IWorkDataQuesDto[];
            localStorage.setItem(`generalData`, JSON.stringify(this.coverForm.GeneralData));
          }
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
          this.coverForm.GeneralData = this.generalDataDto;
          this.GetFormData();
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
  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        const isLoggedIn = this.authService.getToken();
        if (isLoggedIn != "") {
          let res_ = this.authService.decodedToken(isLoggedIn);
          var role = res_.roles;
          let generalData = localStorage.getItem(`generalData`);
          if (generalData) {
            this.coverForm.GeneralData = JSON.parse(generalData) as IGeneralDataDto;
            
            this.workData = this.coverForm.GeneralData.CompanyInfo;
            this.GetWilayat(+this.workData[6].inputValue);
            
          }
          else if (res.Data.length > 0) {
            if (res.Data[0].GeneralData) {
              this.coverForm.GeneralData = JSON.parse(res.Data[0].GeneralData);
              
              this.workData = this.coverForm.GeneralData.CompanyInfo;
              this.GetWilayat(+this.workData[6].inputValue);

            }
          }
          else if (+this.companyId != null || +this.companyId != 0) {
            
            this.GetCompanyById(+this.companyId);
          }
          this.Loader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
  }
  ngOnDestroy() {
    
    let generalData = localStorage.getItem(`generalData`);
    if (generalData) {
      localStorage.removeItem(`generalData`);
    }
    
    this.coverForm.GeneralData.CompanyInfo = this.workData as IWorkDataQuesDto[];
    localStorage.setItem(`generalData`, JSON.stringify(this.coverForm.GeneralData));
  }
  setDataLocalStorage() {

    let generalData = localStorage.getItem(`generalData`);
    if (generalData) {
      localStorage.removeItem(`generalData`);
    }
    this.coverForm.GeneralData.CompanyInfo = this.workData as IWorkDataQuesDto[];
    localStorage.setItem(`generalData`, JSON.stringify(this.coverForm.GeneralData));
  }
}
