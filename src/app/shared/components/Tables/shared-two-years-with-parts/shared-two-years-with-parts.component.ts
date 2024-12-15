import { Component, HostListener, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCodeForm } from 'src/app/code/Dtos/SubCodeHomeDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { ICertificationDto, ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto, IQuarterCoverFormDataDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { ICoverFormData, IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { LoginService } from 'src/app/auth/services/login.service';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';
import { forkJoin } from 'rxjs';
import { AuditRuleHomeService } from 'src/app/auditing-rules/Services/audit-rule-home.service';
import { IAuditRule } from 'src/app/auditing-rules/Dtos/CodeHomeDto';
import Swal from 'sweetalert2';
import { IGeneralDataDto, IWorkDataChkDto, IWorkDataQuesDto } from 'src/app/Forms/Dtos/WorkDataDto';
import { IFilteredListDto } from 'src/app/shared/Dtos/TablesDto';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';

@Component({
  selector: 'app-shared-two-years-with-parts',
  templateUrl: './shared-two-years-with-parts.component.html',
  styleUrls: ['./shared-two-years-with-parts.component.css']
})
export class SharedTwoYearsWithPartsComponent {
  @Input() formId!: string;
  @Input() tableId!: string;
  Loader: boolean = false;
  isChecked!: boolean;
  table: IGetTableDto = {
    id: 0,
    arName: '',
    enName: '',
    arHeading: '',
    enHeading: '',
    arNotes: '',
    enNotes: '',
    Type: '',
    Order: '',
    formId: 0,
    period: 0,
    IsActive: false,
    IsTotal: false,
    totalTitleAr: '',
    totalTitleEn: '',
    IsDisabled: false,
    formContents: [], // Initialize as an empty array
    tableParts: []    // Initialize as an empty array
  };
  coverForm: ICoverFormDetailsDto = this.getDefaultCoverForm();
  tablePartsCount = 0;
  countries!: IGetCountriesDto[];
  activities!: IGetActivitiesDto[];
  selectedValue!: string;
  companyId!: string;
  formData!: IDataDto[];
  checkFormData: boolean = false;
  auditRules: IAuditRule[] = [];
  filteredListDto: IFilteredListDto[] = [];
  sectors!: IGetActivitiesDto[];
  company: ICompany = {
    activityId: 0,
    arActivityName: '',
    enActivityName: '',
    address: '',
    arName: '',
    enName: '',
    compRegNumber: '',
    municipalityNumber: '',
    fax: '',
    telNumber: '',
    activity: '',
    subActivity: '',
    governorates: '',
    governoratesId: 0,
    sectorId: 0,
    mailBox: '',
    wilayatId: 0,
    wilayat: '',
    embeded: '',
    webSite: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    status: '',
    id: 0,
    researcherId: '',
    accountingPeriod: new Date(),
    legalType: '',
    pathImgProfile: '',
    researcherArName: '',
    researcherMandateArName: '',
    activityName: '',
    sectorName: '',
    subActivityName: '',
    institutionHeadquarters: '',
    completionAccPeriod: new Date(),
    dateOfWork: new Date(),
    institutionVlaue: '',
    sectorCode: '',
    activityCode: '',
    subActivityCode: '',
    companyEmails: []
  };
  sectorCode: string="";

  workData: IWorkDataQuesDto[] = [
    { arName: 'اسم  المنشأة : ', enName: ' :  Name of  Enterprise', inputValue: '', isSelect: false },
    { arName: 'رقم السجل التجارى : ', enName: ' :  Commercial Registration No', inputValue: '', isSelect: false },
    { arName: 'رقم الترخيص البلدي : ', enName: ' :  Municipality Number', inputValue: '', isSelect: false },
    { arName: 'النشاط الاقتصادى الرئيسى : ', enName: ' :  Main Economic Activity', inputValue: '', isSelect: false },
    { arName: 'النشاط الثانوى : ', enName: ' :  Secondary Activity', inputValue: '', isSelect: false },
    { arName: 'عنوان المنشاة : ', enName: ' :  Address and Location', inputValue: '', isSelect: false },
    { arName: 'المحافظة : ', enName: ' :  Region', inputValue: '', isSelect: false },
    { arName: 'الولاية : ', enName: ' :  Wilayat', inputValue: '', isSelect: false },
    { arName: 'رقم صندوق البريد : ', enName: ' :  P.O.Box', inputValue: '', isSelect: false },
    { arName: 'الرمز البريدى : ', enName: ' :  Postal Code', inputValue: '', isSelect: false },
    { arName: 'رقم الهاتف : ', enName: ' :  Telephone No', inputValue: '', isSelect: false },
    { arName: 'رقم الفاكس : ', enName: ' :  Fax No', inputValue: '', isSelect: false },
    { arName: 'البريد الالكترونى : ', enName: ' :  Email', inputValue: '', isSelect: false },
    { arName: 'الموقع الإلكتروني : ', enName: ' :  Website', inputValue: '', isSelect: false },
    { arName: 'رمز القطاع : ', enName: ' :  sector Code', inputValue: '', isSelect: false },
    { arName: 'الكيان القانونى للمنشأة ( يرجى وضع اشارة صح على حالةالمنشأة) : ', enName: ' :  The Legal Type of Organization (tick approprate reponse)', inputValue: '', isSelect: false },
  ];
  generalDataDto: IGeneralDataDto = {
    ChekInfo: 0,
    CompanyInfo: this.workData,
    from: '',
    to: '',
    describeMainActivity: '',
    dataSource: 0,
    countryId:0
  };
  constructor(private route: ActivatedRoute, private authService: LoginService, private formServices: FormService,
    private sharedServices: SharedService, private sectorsAndActivitiesServices: SectorAndActivitiesService,
    private companyServices: CompanyHomeService,private auditRuleHomeService: AuditRuleHomeService) {


  }
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.formId = params.get('formId')!;
      this.tableId = params.get('tableId')!;
      this.companyId = params.get('companyId')!;
      this.GetCompanyById(+this.companyId);
      this.GetFormById(+this.formId);
      this.GetActivites();
      this.GetCountrites();
      this.GetSectors();
    });
  }
  private getDefaultCoverForm(): ICoverFormDetailsDto {
    return {
      id: 0,
      typeQuarter: 0,
      tables: [],
      arName: "",
      enName: "",
      arNotes: "",
      enNotes: "",
      reviewYear: "",
      status: 0,
      quarterCoverData: {} as IQuarterCoverFormDataDto,
      coverFormData: {} as ICoverFormData,
      certification: {} as ICertificationDto,
      codeActivity: "",
      codeSectorName: "",
      GeneralData: {} as IGeneralDataDto,
      Type: 0,
    };
  }
  onRadioChange(event: Event, value: string) {
    this.selectedValue = value;
  }
  GetCompanyById(id: number) {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
          this.company = res.Data;
          this.sectorCode = this.company.sectorCode;
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

              item.inputValue = this.company.subActivityCode;
            }
            else if (item.arName.includes('النشاط الاقتصادى الرئيسى : ')) {

              item.inputValue = this.company.activityCode;
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
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.table = res.Data;
          this.tablePartsCount = this.table.tableParts.length;
          this.table.formContents.forEach((formContent: IGetQuestionDto) => {
            // Calculate the total number of parts (doubled)
            const totalPartsCount = this.tablePartsCount * 2;

            // Initialize the `values` array for the main content
            formContent.values = Array(totalPartsCount).fill(0);

            // Initialize the `values` array for each subcode
            if (formContent.code.SubCodes) {
              formContent.code.SubCodes.forEach((subCode: any) => {
                subCode.values = Array(totalPartsCount).fill(0);
              });
            }
          });
        }
        this.GetFormData();

      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }

  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.coverForm = res.Data;
          this.GetTableById(+this.tableId);

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  GetSectors() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data.getSectorsDtos;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetSectors(0, '').subscribe(observer);
  }
  toggleDropdownCountry(index: number, indexSub: number, filteredIndex: number = 0) {
    let filteredListDto: IFilteredListDto[] = [];
    let isDropdownOpen : boolean = true;
    
    // تحقق من طول المصفوفة لتغيير العنصر المطلوب فقط
    if (filteredIndex === 0) {
      filteredListDto = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_0`
      );
      isDropdownOpen = !filteredListDto[0].isDropdownOpen;
    }
    else if (filteredIndex === 1) {
      filteredListDto= this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_1`
      );

      isDropdownOpen = !filteredListDto[0].isDropdownOpen;
    }
    else if (filteredIndex === 2) {
      filteredListDto = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_2`
      );

      isDropdownOpen = !filteredListDto[0].isDropdownOpen;
    }
    else if (filteredIndex === 3) {
      filteredListDto = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_3`
      );

      isDropdownOpen = !filteredListDto[0].isDropdownOpen;
    }
    this.filteredListDto.forEach(item => {
      item.isDropdownOpen = false;
    });
    filteredListDto[0].isDropdownOpen = isDropdownOpen;
  }
  filterCountry(searchTerm: string, index: number, indexSub: number, filteredType: string = "", filteredIndex: number = 0) {


    if (filteredType == "sector") {
      if (filteredIndex == 0) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_0`
        );
        filteredListDto[0].filtered = this.sectors.filter(sector =>
          sector.arName.includes(searchTerm) || sector.code.includes(searchTerm.toUpperCase()) || sector.code.includes(searchTerm.toLowerCase())
        );
      }
      else if (filteredIndex == 1) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_1`
        );
        filteredListDto[0].filtered = this.sectors.filter(sector =>
          sector.arName.includes(searchTerm) || sector.code.includes(searchTerm.toUpperCase()) || sector.code.includes(searchTerm.toLowerCase())
        );
      }

    }
    else if (filteredType == "country") {
      if (filteredIndex == 0) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_0`
        );
        filteredListDto[0].filtered = this.countries.filter(country =>
          country.arName.includes(searchTerm)
        );
      }
      else if (filteredIndex == 1) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_1`
        );
        filteredListDto[0].filtered = this.countries.filter(country =>
          country.arName.includes(searchTerm));
      }
      if (filteredIndex == 2) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_2`
        );
        filteredListDto[0].filtered = this.countries.filter(country =>
          country.arName.includes(searchTerm)
        );
      }
      else if (filteredIndex == 3) {
        let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_3`
        );
        filteredListDto[0].filtered = this.countries.filter(country =>
          country.arName.includes(searchTerm));
      }

    }
  }
  selectCountry(subCode: ISubCodeForm, county: any) {

    subCode.enName = county.enName;
    subCode.arName = county.arName;
    this.filteredListDto.forEach(item => {
      item.isDropdownOpen = false;
    });
  }
  selectCountry1(subCode: ISubCodeForm, county: any) {

    subCode.enName1 = county.enName;
    subCode.arName1 = county.arName;
    this.filteredListDto.forEach(item => {
      item.isDropdownOpen = false;
    });
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown')) {
      this.filteredListDto.forEach(item => {
        item.isDropdownOpen = false;
      });
    }
  }
  selectSector(subCode: ISubCodeForm, county: any) {

    subCode.enName = county.enName;
    subCode.arName = county.arName;
    this.filteredListDto.forEach(item => {
      item.isDropdownOpen = false;
    });
  }
  getFiltered(index: number, indexSub: number, filteredIndex: number = 0): IDropdownList[] {
    
    // Filter the list based on index
    let filtered: IDropdownList[] = [];
    if (filteredIndex == 0) {
      let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_0`
      );
      filtered = filteredListDto[0].filtered;
    }
    if (filteredIndex == 1) {
      let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_1`
      );
      filtered = filteredListDto[0].filtered;
    }
    if (filteredIndex == 2) {
      let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_2`
      );
      filtered = filteredListDto[0].filtered;
    }
    if (filteredIndex == 3) {
      let filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
        f => f.index === `${index}_${indexSub}_3`
      );
      filtered = filteredListDto[0].filtered;
    }
    // Map the filtered list to IDropdownList
    return filtered.map(f => ({
      id: f.id,            // Map the id correctly
      arName: f.arName,    // Map arName
      enName: f.enName,    // Map enName
      code: f.code         // Map code
    }));
  }
  getFilteredIsDropdownOpen(index: number, indexSub: number, filteredIndex: number = 0): boolean {

    // Filter the list based on index
    let isDropdownOpen = false;
    if (filteredIndex === 1) {
      if (this.filteredListDto.length > 1) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_1`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.countries,
          index: `${index}_${indexSub}_1`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    else if (filteredIndex === 0) {
      if (this.filteredListDto.length > 0) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_0`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.countries,
          index: `${index}_${indexSub}_0`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    else if (filteredIndex === 2) {
      if (this.filteredListDto.length > 2) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_2`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.countries,
          index: `${index}_${indexSub}_2`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    else if (filteredIndex === 3) {
      if (this.filteredListDto.length > 3) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_3`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.countries,
          index: `${index}_${indexSub}_3`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    // Map the filtered list to IDropdownList
    return isDropdownOpen;
  }
  getFilteredIsDropdownOpenSector(index: number, indexSub: number, filteredIndex: number = 0): boolean {

    // Filter the list based on index
    let isDropdownOpen = false;
    if (filteredIndex === 1) {
      if (this.filteredListDto.length > 1) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_1`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
        else {
          let filteredDto: IFilteredListDto = {
            filtered: this.sectors,
            index: `${index}_${indexSub}_1`,
            isDropdownOpen: false
          };
          this.filteredListDto.push(filteredDto);
        }
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.sectors,
          index: `${index}_${indexSub}_1`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    else if (filteredIndex === 0) {
      if (this.filteredListDto.length > 0) {
        const filteredListDto: IFilteredListDto[] = this.filteredListDto.filter(
          f => f.index === `${index}_${indexSub}_0`
        );
        if (filteredListDto.length > 0)
          isDropdownOpen = filteredListDto[0].isDropdownOpen;
        else {
          let filteredDto: IFilteredListDto = {
            filtered: this.sectors,
            index: `${index}_${indexSub}_0`,
            isDropdownOpen: false
          };
          this.filteredListDto.push(filteredDto);
        }
      }
      else {
        let filteredDto: IFilteredListDto = {
          filtered: this.sectors,
          index: `${index}_${indexSub}_0`,
          isDropdownOpen: false
        };
        this.filteredListDto.push(filteredDto);
      }
    }
    // Map the filtered list to IDropdownList
    return isDropdownOpen;
  }
  addSubCodeRow(code: ICode, index: number, filteredType: string = "") {
    const subCode: ISubCodeForm = {
      arName: '',
      codeId: code.Id,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: [],
      values: [0, 0],
      connectedWithId: 0,
      connectedWithLevel: 0,
      connectedWithType: '',
      IsTrueAndFalse: false,
      IsTransaction: false,
      IsHdd: false,
      valueCheck: false,
      arName1: '',
      enName1: ''
    }
    code.SubCodes.push(subCode);
    const newSubLength = code.SubCodes.length;
    if (filteredType == "sector") {
      let filteredDto: IFilteredListDto = {
        filtered: this.sectors,
        index: `${index}_${(newSubLength - 1)}_0`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);
      filteredDto = {
        filtered: this.sectors,
        index: `${index}_${(newSubLength - 1)}_1`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);
    }
    else if (filteredType == 'country') {
      let filteredDto: IFilteredListDto = {
        filtered: this.countries,
        index: `${index}_${(newSubLength - 1)}_0`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);
      filteredDto = {
        filtered: this.countries,
        index: `${index}_${(newSubLength - 1)}_1`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);
      filteredDto = {
        filtered: this.countries,
        index: `${index}_${(newSubLength - 1)}_2`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);
      filteredDto = {
        filtered: this.countries,
        index: `${index}_${(newSubLength - 1)}_3`,
        isDropdownOpen: false
      };
      this.filteredListDto.push(filteredDto);

    }
  }


  removeSubCodeRow(formContent: IGetQuestionDto, subCode: ISubCodeForm): void {
    const index = formContent.code.SubCodes.indexOf(subCode);
    if (index !== -1) {
      for (let i = 0; i < formContent.values.length; i++) {
        if (i < subCode.values.length) {
          formContent.values[i] -= subCode.values[i];
        }
      }
      formContent.code.SubCodes.splice(index, 1); // Remove the subCode from the array
    }
  }

  GetActivites() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data.getActivitiesDtos;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(0, '').subscribe(observer);
  }
  GetCountrites() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.countries = res.Data.getCountryDtos;
        }
        else {
          this.countries = [];
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetCountries(0, '').subscribe(observer);
  }
  onArCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.arName === subCode.arCountry);
    if (selectedCountry) {
      subCode.enCountry = selectedCountry.enName;
    }
  }

  onEnCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.enName === subCode.enCountry);
    if (selectedCountry) {
      subCode.arCountry = selectedCountry.arName;
    }
  }
  addSubCodeToSubRow(SubCode: ISubCodeForm) {
    const subCode: ISubCodeForm = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: [],
      values: [0, 0],
      connectedWithId: 0,
      connectedWithLevel: 0,
      connectedWithType: '',
      IsTrueAndFalse: false,
      IsTransaction: false,
      IsHdd: false,
      valueCheck: false,
      arName1: '',
      enName1: ''
    }

    SubCode.subCodes.push(subCode);
  }
  removeSubCodeFromSubRow(formContent: IGetQuestionDto, SubCode: ISubCodeForm, _subCode: ISubCodeForm, indexSub: number): void {
    const index = SubCode.subCodes.indexOf(_subCode);
    if (index !== -1) {
      // طرح القيم المقابلة في مصفوفة `value`
      for (let i = 0; i < SubCode.values.length; i++) {
        if (i < _subCode.values.length) {
          SubCode.values[i] -= _subCode.values[i];
        }
      }

      // إزالة الـsubCode من المصفوفة
      SubCode.subCodes.splice(index, 1);
      this.handelSupParent(formContent, SubCode, indexSub);
    }
  }
  GetFormData() {
    this.Loader = true;
    forkJoin([
      this.auditRuleHomeService.GetAllAuditRules(0),
    ]).subscribe({
      next: (auditRulesResponse: any) => {
        const observer = {
          next: (res: any) => {
            this.auditRules = auditRulesResponse[0].Data.getAuditRuleDtos;
            const isLoggedIn = this.authService.getToken();
            if (isLoggedIn != "") {
              let res_ = this.authService.decodedToken(isLoggedIn);
              var role = res_.roles;
              if (res.Data) {
                if (res.Data.length > 0) {
                  const groupedTables = res.Data[0].dataDtos.reduce((acc: any, item: any) => {
                    // Check if the TableId already exists in the accumulator
                    if (!acc[item.TableId]) {
                      acc[item.TableId] = {
                        TableId: item.TableId,
                        items: []
                      };
                    }
                    // Push the current item into the corresponding TableId group
                    acc[item.TableId].items.push(item);
                    return acc;
                  }, {});

                  // Convert the grouped object into an array of tables
                  const tablesList = Object.values(groupedTables);

                  const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
                  if (storedCoverForm) {
                    this.coverForm = JSON.parse(storedCoverForm);
                  }
                  tablesList.forEach((table: any) => {
                    const tableIndex = this.coverForm.tables.findIndex(t => t.id == table.TableId);
                    if (tableIndex !== -1) {
                      this.coverForm.tables[tableIndex].IsDisabled = table.items[0].IsDisabled;

                      if (this.coverForm.tables[tableIndex].Type == "1") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          formContent.values = formContent.values || [0, 0, 0];
                          formContent.values[1] = formContent.values[1] || 0;
                          formContent.values[2] = 0; // Set transaction explicitly to 0 since it's derived
                          formContent.values[0] = formContent.values[2] || 0;

                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: ISubCodeForm) => {
                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[2] = 0; // Set transaction explicitly to 0
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              if (subCode.subCodes) {
                                subCode.subCodes.forEach((_subCode: any) => {
                                  // Initialize subCode `values` array if it doesn't exist
                                  _subCode.values = _subCode.values || [0, 0, 0];

                                  // Ensure the `values` array has the correct length and initial values
                                  _subCode.values[0] = _subCode.values[0] || 0; // lastYear
                                  _subCode.values[2] = 0; // Set transaction explicitly to 0
                                  _subCode.values[1] = _subCode.values[1] || 0; // nextYear
                                });
                              }
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "2") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                          formContent.values = formContent.values || [0, 0];
                          formContent.values[0] = formContent.values[0] || 0;
                          formContent.values[1] = formContent.values[1] || 0;
                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {

                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              if (subCode.subCodes) {
                                subCode.subCodes.forEach((_subCode: any) => {
                                  // Initialize subCode `values` array if it doesn't exist
                                  _subCode.values = _subCode.values || [0, 0, 0];

                                  // Ensure the `values` array has the correct length and initial values
                                  _subCode.values[0] = _subCode.values[0] || 0; // lastYear
                                  _subCode.values[2] = 0; // Set transaction explicitly to 0
                                  _subCode.values[1] = _subCode.values[1] || 0; // nextYear
                                });
                              }
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "6") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                          formContent.values = formContent.values || [0, 0, 0];
                          formContent.values[0] = formContent.values[0] || 0;
                          formContent.values[1] = formContent.values[1] || 0;
                          formContent.values[2] = formContent.values[2] || 0;
                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              subCode.values[2] = subCode.values[2] || 0; // nextYear

                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "3" || this.coverForm.tables[tableIndex].Type == "7") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Initialize the `values` array with zeroes, ensuring the first value is set to 0
                          formContent.values = [0, ...Array(this.coverForm.tables[tableIndex].tableParts.length).fill(0)];
                          // Initialize the `values` array for each subCode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Set the first value to 0, and the rest based on the number of parts
                              subCode.values = [0, ...Array(this.coverForm.tables[tableIndex].tableParts.length).fill(0)];
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "4") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Calculate the total number of parts (doubled)
                          const totalPartsCount = this.coverForm.tables[tableIndex].tableParts.length * 2;

                          // Initialize the `values` array for the main content
                          formContent.values = Array(totalPartsCount).fill(0);

                          // Initialize the `values` array for each subcode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              subCode.values = Array(totalPartsCount).fill(0);
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "5") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Initialize the `values` array with zeroes, ensuring the first value is set to 0
                          formContent.values = [0, ...Array(this.coverForm.tables[tableIndex].period).fill(0)];

                          // Initialize the `values` array for each subCode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Set the first value to 0, and the rest based on the number of parts
                              subCode.values = [0, ...Array(this.coverForm.tables[tableIndex].period).fill(0)];
                            });
                          }
                        });
                      }
                    }
                    table.items.forEach((item: any) => {
                      if (item.codeType == 4) {
                        const level1ItemIndex_ = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.codeId);
                        this.coverForm.tables[tableIndex].formContents[level1ItemIndex_].valueCheck = item.valueCheck
                      }
                      else if (item.level == 1) {
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.codeId);
                        // Store the itemIndex of level 1 item
                        if (level1ItemIndex !== -1) {
                          if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId != 4 && this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId != 1)
                            this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes = [];
                          this.coverForm.tables[tableIndex].formContents[level1ItemIndex].values = item.codes;
                        }
                      }
                      else if (item.level == 2) {

                        // Find the corresponding level 1 item first
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.parentCodeId);
                        if (level1ItemIndex !== -1) {
                          // Now find the correct subCode within the level 1 item's SubCodes
                          if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId == 1 || this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId == 4) {

                            const subCodes = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes;
                            const subCodeIndex = subCodes.findIndex(subCode => subCode.Id === item.codeId);
                            if (subCodeIndex !== -1) {
                              subCodes[subCodeIndex].valueCheck = item.valueCheck
                              subCodes[subCodeIndex].values = item.codes;
                            }
                          }
                          else {
                            const subCode: ISubCodeForm = {
                              arName: item.arName,
                              codeId: item.parentCodeId,
                              enName: item.enName,
                              Id: 0,
                              QuestionCode: '',
                              subCodes: [],
                              values: item.codes,
                              connectedWithId: 0,
                              connectedWithLevel: 0,
                              connectedWithType: '',
                              IsTrueAndFalse: false,
                              IsTransaction: false,
                              IsHdd: false,
                              valueCheck: false,
                              arName1: item.arName1,
                              enName1: item.enName1
                            }
                            this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes.push(subCode)

                          }
                        }
                      }
                      else if (item.level == 3) {
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.parentCodeId);
                        if (level1ItemIndex !== -1) {
                          const subCodeIndex = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes.findIndex(subCode => subCode.Id === item.subCodeParentId);
                          if (subCodeIndex !== -1) {
                            if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].IsHdd == true) {

                              const subCode: ISubCodeForm = {
                                arName: item.arName,
                                codeId: item.codeId,
                                enName: item.enName,
                                Id: 0,
                                QuestionCode: "",
                                subCodes: [],
                                values: item.codes,
                                connectedWithId: item.connectedWithId,
                                connectedWithLevel: item.connectedWithLevel,
                                connectedWithType: item.connectedWithType,
                                IsTrueAndFalse: false,
                                IsTransaction: false,
                                IsHdd: false,
                                valueCheck: item.valueCheck,
                                arName1: item.arName1,
                                enName1: item.enName1
                              }
                              const subCodeExists = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].subCodes
                                .some(existingSubCode => existingSubCode.arName === subCode.arName && existingSubCode.enName === subCode.enName
                                );
                              if (!subCodeExists)
                                this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].subCodes.push(subCode);
                            }
                          }
                        }

                      }
                    });
                  });
                  localStorage.removeItem(`coverForm${this.coverForm.id}`);
                  localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
                }
              }
              else if (role === 'Admin' || role === 'Researchers') {

                localStorage.removeItem(`coverForm${this.coverForm.id}`);
                // this.modifyInputById(this.coverForm.typeQuarter);
                return;
              }
              const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
              if (storedCoverForm) {
                this.coverForm = JSON.parse(storedCoverForm);
              }

              const tableIndex = this.coverForm.tables.findIndex(t => t.id === +this.tableId);
              if (tableIndex !== -1 && this.coverForm.tables[tableIndex].formContents[0].values != undefined) {
                this.table = this.coverForm.tables[tableIndex];

                for (let index = 0; index < this.table.formContents.length; index++) {
                  const rule = this.auditRules.find(r => r.codeParent == this.table.formContents[index].code.QuestionCode && r.Type == "1")
                  if (rule) {
                    this.table.formContents[index].isRule = true;
                  }
                }
              }
            }
            // this.modifyInputById(this.coverForm.typeQuarter);
            this.Loader = false;
          },
          error: (err: any) => {
            this.sharedServices.handleError(err);
            this.Loader = false;
          },
        };
        this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
      }
    })
  }
  handelSupParent(formContent: IGetQuestionDto, subCode: ISubCodeForm, index: number) {
    // Ensure subCode has subCodes to process
    if (subCode.subCodes && subCode.subCodes.length > 0) {
      // Iterate over the values array of the parent subCode
      for (let i = 0; i < subCode.values.length; i++) {
        // Sum up the corresponding values from the subCodes
        subCode.values[i] = subCode.subCodes.reduce((sum, _subCode) => {
          return sum + (_subCode.values[i] || 0); // Ensure to handle undefined values safely
        }, 0); // Start the summation from 0
      }

      formContent.code.SubCodes[index] = subCode;
    }
    else {
      for (let i = 0; i < formContent.values.length; i++) {
        // Sum up the corresponding values from the subCodes
        formContent.values[i] = 0;
      }
    }
    this.handleParent(formContent);
  }
  updateParentValue(subCode: any, formContent: any, index: number): void {
    // Initialize formContent values if not present
    if (!formContent.values) {
      formContent.values = [];
    }

    // Initialize subCode values if not present
    if (!subCode.values) {
      subCode.values = [];
    }

    // Calculate the sum of all subCode values for the given index
    let sum = 0;
    formContent.code.SubCodes.forEach((sub: any) => {
      if (sub.values && sub.values[index]) {
        sum += sub.values[index];
      }
    });

    // Update the parent formContent value with the sum
    formContent.values[index] = sum;

    // Optionally, update any other logic or status here if needed
  }

  handleParent(formContent: IGetQuestionDto) {
    this.changeStatus(this.coverForm.status);
    const rule = this.auditRules.find(r => r.codeParent == formContent.code.QuestionCode && r.Type == "1")
    if (rule) {
      const ruleParts = rule.Rule.split('=');
      if (ruleParts.length < 2) {
        Swal.fire({
          icon: 'error',
          title: `تنسيق القاعدة غير صحيح: ${rule.Rule}`,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
        return;
      }
      const ruleExpression = ruleParts[1].trim();
      // Extract numbers and operators
      const numberPattern = /\d+/g; // Matches numeric values
      const operatorPattern = /[\+\-]/g; // Matches operators
      // Extract numbers and operators
      const numbers = ruleExpression.match(numberPattern)?.map(val => Number(val.trim())) || [];
      const operators = ruleExpression.match(operatorPattern) || [];

      // Ensure correct length of operators and numbers
      if (numbers.length === 0) {
        Swal.fire({
          icon: 'error',
          title: `لم يتم العثور على أرقام صالحة في تعبير القاعدة: ${ruleExpression}`,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
        return;
      }
      let valuesLength = formContent.values.length;
      let subCodes = formContent.code.SubCodes;

      // Reset sums for current formContent
      let indexSums = new Array(valuesLength).fill(0);
      for (let j = 0; j < subCodes.length; j++) {
        let subCodeQuestionCode = Number(subCodes[j].QuestionCode);
        if (numbers.includes(subCodeQuestionCode)) {
          let subCodeValues = subCodes[j].values;

          // Find the operator before the current number
          let indexOfCode = numbers.indexOf(subCodeQuestionCode);
          let operator = (indexOfCode > 0) ? operators[indexOfCode - 1] : '+';
          // Apply the correct operation based on the operator
          for (let k = 0; k < subCodeValues.length; k++) {
            if (k < indexSums.length) {
              if (operator === '-' || !operator) {
                indexSums[k] -= subCodeValues[k];
              } else {
                indexSums[k] += subCodeValues[k];
              }
            }
          }
        }
      }
      let totalValues = new Array(valuesLength).fill(0); // Initialize totalValues based on length of values
      // Add the accumulated sums to the totalValues
      for (let l = 0; l < totalValues.length; l++) {
        if (l < indexSums.length) {
          totalValues[l] += indexSums[l];
          formContent.values[l] = totalValues[l]
        }
      }
    }
    else {
      for (let index = 0; index < formContent.values.length; index++) {
        let sum = 0;
        for (let i = 0; i < formContent.code.SubCodes.length; i++) {
          sum += formContent.code.SubCodes[i].values[index]
        }
        formContent.values[index] = sum
      }
    }
    let foundFormContent = this.table.formContents.find(f => f.Id == formContent.Id);
    if (foundFormContent) {
      Object.assign(foundFormContent, formContent); // Update the object with new formContent properties
    }
    const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
    if (storedCoverForm) {
      this.coverForm = JSON.parse(storedCoverForm);
    }
    const tableIndex = this.coverForm.tables.findIndex(t => t.id == this.table.id);
    if (tableIndex !== -1) {
      this.coverForm.tables[tableIndex] = this.table;
      localStorage.removeItem(`coverForm${this.coverForm.id}`);
      localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
    }
  }
  getSumOfValues(index: number): number {
    return this.table.formContents.reduce((sum, formContent) => {
      if (formContent.code.QuestionCode !== "7021") {
        sum += (formContent.values[index] || 0);
      }
      return sum;
    }, 0);
  }
  changeStatus(status: number) {
    if (status < 3)
      this.BeginningForm();
  }
  BeginningForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {

        let storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
        var coverForm!: ICoverFormDetailsDto
        if (storedTables) {
          coverForm = JSON.parse(storedTables);
          const tableIndex = coverForm.tables.findIndex(t => t.id === this.table.id);
          coverForm.status = 3;
          if (tableIndex !== -1) {
            coverForm.tables[tableIndex] = this.table;
          }
          localStorage.removeItem(`coverForm${this.coverForm.id}`);
        }

        localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(coverForm));
        this.GetFormById(+this.formId)
        this.Loader = false;
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    if (+this.companyId > 0) {
      this.formServices.BeginningForm(+this.formId, +this.companyId).subscribe(observer);
    }

  }
  clearIfZero(values: any[], index: number): void {
    if (values[index] === 0) {
      values[index] = null; // مسح القيمة إذا كانت تساوي صفرًا
    }
  }

  restoreIfNotPositive(values: number[], index: number): void {
    if (values[index] === null) {
      values[index] = 0; // إعادة القيمة إلى صفر إذا كانت غير موجبة
    }
  }
}