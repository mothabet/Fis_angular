import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ResearcherHomeService } from 'src/app/researcher/services/researcher-home.service';
import { IAddReportPartDto, IFieldDto, IGetReportDto, IGetReportPartsDto, IReportFilterDto, ITableDto, ITableFieldDto, ReportActivityField, ReportField } from '../../Dtos/ReportDto';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { IGetTableRep } from 'src/app/Forms/Dtos/TableDto';
import { SectorsAndActivitiesModule } from 'src/app/sectors-and-activities/sectors-and-activities.module';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';

@Component({
  selector: 'app-report-contents',
  templateUrl: './report-contents.component.html',
  styleUrls: ['./report-contents.component.css']
})
export class ReportContentsComponent implements OnInit {
  @ViewChild('chooseTable') chooseTableModal!: ElementRef;
  tableType: number = 0;
  reportYearFrom: number | undefined;
  reportYearTo: number | undefined;
  showLoader: boolean = false;
  companyFields: IFieldDto[] = [];
  researcherFields: IFieldDto[] = [];
  formFields: IFieldDto[] = [];
  tableFields: IFieldDto[] = [];
  sectorFields: IFieldDto[] = [];
  activitiesFields: IFieldDto[] = [];
  subActivitiesFields: IFieldDto[] = [];
  governoratesFields: IFieldDto[] = [];
  wilayatFields: IFieldDto[] = [];

  generalDataFields: IFieldDto[] = [
    { dataType: 'String', name: 'اسم المنشأة', arName: '' },
    { dataType: 'String', name: 'رقم السجل التجارى', arName: '' },
    { dataType: 'String', name: 'رقم الترخيص البلدي', arName: '' },
    { dataType: 'String', name: 'النشاط الاقتصادى الرئيسى', arName: '' },
    { dataType: 'String', name: 'النشاط الثانوى', arName: '' },
    { dataType: 'String', name: 'عنوان المنشاة', arName: '' },
    { dataType: 'String', name: 'المنطقة', arName: '' },
    { dataType: 'String', name: 'الولاية', arName: '' },
    { dataType: 'String', name: 'رقم صندوق البريد', arName: '' },
    { dataType: 'String', name: 'الرمز البريدى', arName: '' },
    { dataType: 'String', name: 'رقم الهاتف', arName: '' },
    { dataType: 'String', name: 'رقم الفاكس', arName: '' },
    { dataType: 'String', name: 'البريد الالكترونى', arName: '' },
    { dataType: 'String', name: 'الموقع الإلكتروني', arName: '' },
    { dataType: 'bool', name: 'منشاة فردية', arName: '' },
    { dataType: 'bool', name: 'تضامنية', arName: '' },
    { dataType: 'bool', name: 'توصية', arName: '' },
    { dataType: 'bool', name: 'محاصة', arName: '' },
    { dataType: 'bool', name: 'مساهمة ( عامه او مقفله )', arName: '' },
    { dataType: 'bool', name: 'محدودة المسؤولية', arName: '' },
    { dataType: 'bool', name: 'فرع شركة اجنبية', arName: '' },
    { dataType: 'bool', name: 'أخرى (حدد)', arName: '' },
    { dataType: 'DateTime', name: 'الفترة او السنه الماليه من', arName: '' },
    { dataType: 'DateTime', name: 'الفترة او السنه الماليه إالى', arName: '' },
  ];
  certificationFields: IFieldDto[] = [
    { dataType: 'String', name: 'اسم معبئ الاستمارة', arName: '' },
    { dataType: 'String', name: 'رقم الهاتف', arName: '' },
    { dataType: 'DateTime', name: 'تاريخ التعبئة', arName: '' },
  ]
  coverFields: IFieldDto[] = [
    { dataType: 'Int', name: 'رمز النشاط', arName: '' },
    { dataType: 'Int', name: 'رقم الاستماره', arName: '' },
    { dataType: 'Int', name: 'المرجع. سنة', arName: '' }
  ]
  quarterCoverFields: IFieldDto[] = [
    { dataType: 'String', name: 'اسم مؤسستك', arName: '' },
    { dataType: 'String', name: 'الرمز البريدي', arName: '' },
    { dataType: 'String', name: 'رقم الاستماره', arName: '' },
    { dataType: 'String', name: 'رقم الهاتف', arName: '' },
    { dataType: 'String', name: 'رقم الفاكس', arName: '' },
    { dataType: 'String', name: 'عنوان البريد الإلكتروني', arName: '' },
    { dataType: 'String', name: 'التوزيع الجغرافي للاستثمار الأجنبي المباشر المتجه إلى الخارج (حسب الدولة)', arName: '' },
  ]
  transformedReport: ReportField[] = [];  // Declare transformedReport
  isDropdownOpen = false;
  isFormContentDropdownOpen = false;
  isActivityDropdownOpen = false;
  isCountryDropdownOpen = false;
  isYearsDropdownOpen = false;
  isCompanyDropdownOpen = false;
  isGovernorateDropdownOpen = false;
  isWilayatDropdownOpen = false;
  isSectorDropdownOpen = false;
  searchTerm: string = '';
  searchFormContentTerm: string = '';
  searchActivityTerm: string = '';
  searchCountryTerm: string = '';
  searchYearTerm: string = '';
  searchCompanyTerm: string = '';
  searchGovernorateTerm: string = '';
  searchWilayatTerm: string = '';
  searchSectorTerm: string = '';
  filteredCodes: ICode[] = [];
  report: IAddReportPartDto = {
    part: '',
    query: '',
    reportType: '',
    seconedTable: '',
    withChart: false,  // default to false
    chartType: 0,      // default chart type
    reportId: 0,     // default ID
    reportDetails: '',
  };
  tables: ITableDto[] = [];
  reportId!: string
  selectedTable: IReportFilterDto | null = null;
  stringFilterItems: IReportFilterDto[] = [
    { id: 1, arName: 'يساوي', enName: '=' },
    { id: 2, arName: 'لا يساوي', enName: '<>' },
  ];
  numberFilterItems: IReportFilterDto[] = [
    { id: 1, arName: 'اكبر من', enName: '>' },
    { id: 2, arName: 'اقل من', enName: '<' },
    { id: 3, arName: 'اقل من او يساوي', enName: '<=' },
    { id: 4, arName: 'اكبر من او يساوي', enName: '>=' },
    { id: 5, arName: 'يساوي', enName: '=' },
  ];
  companyTables: IReportFilterDto[] = [
    { id: 3, arName: 'الباحثين', enName: 'Researcher' },
    { id: 4, arName: 'القطاعات', enName: 'Sectors' },
    { id: 5, arName: 'الأنشطة الرئيسية', enName: 'Activities' },
    { id: 7, arName: 'الأنشطة الفرعية', enName: 'SubActivities' },
    { id: 7, arName: 'المحافظات', enName: 'Governorates' },
    { id: 8, arName: 'الولايات', enName: 'Wilayats' }
  ];
  researcherTables: IReportFilterDto[] = [
    { id: 1, arName: 'الشركات', enName: 'Companies' },
  ];
  formTables: IReportFilterDto[] = [
    { id: 1, arName: 'الجداول', enName: 'Tables' },
  ];
  formContentTables: IReportFilterDto[] = [
    { id: 1, arName: 'الغلاف', enName: 'Cover' },
    { id: 2, arName: 'البيانات العامة', enName: 'GeneralData' },
    { id: 3, arName: 'الشهادة', enName: 'Certification' },
  ];
  tableRepTables: IReportFilterDto[] = [
    { id: 1, arName: 'الانشطة', enName: 'ActivitiesRep' },
    { id: 2, arName: 'الدول', enName: 'Countries' },
    { id: 3, arName: 'القطاعات', enName: 'SectorsRep' },
    { id: 4, arName: 'الشركات', enName: 'CompaniesRep' },
    { id: 3, arName: 'المحافظات', enName: 'GovernoratesRep' },
    { id: 4, arName: 'الولايات', enName: 'WilayatRep' },
  ];
  codes: ICode[] = [];
  tablesRep: IGetTableRep[] = [];
  filteredTables: IGetTableRep[] = [];
  reports!: any[];
  formContents!: any[];
  currentFields: IFieldDto[] = this.coverFields;
  activities: IDropdownList[] = []
  countries: IDropdownList[] = []
  companies: IDropdownList[] = []
  governorates: IDropdownList[] = []
  wilayat: IDropdownList[] = []
  sectors: IDropdownList[] = []
  years: IDropdownList[] = [
    { id: 1, arName: '2007', enName: '2007', code: '' },
    { id: 2, arName: '2008', enName: '2008', code: '' },
    { id: 3, arName: '2009', enName: '2009', code: '' },
    { id: 4, arName: '2010', enName: '2010', code: '' },
    { id: 5, arName: '2011', enName: '2011', code: '' },
    { id: 6, arName: '2012', enName: '2012', code: '' },
    { id: 7, arName: '2013', enName: '2013', code: '' },
    { id: 8, arName: '2014', enName: '2014', code: '' },
    { id: 9, arName: '2015', enName: '2015', code: '' },
    { id: 10, arName: '2016', enName: '2016', code: '' },
    { id: 11, arName: '2017', enName: '2017', code: '' },
    { id: 12, arName: '2018', enName: '2018', code: '' },
    { id: 13, arName: '2019', enName: '2019', code: '' },
    { id: 14, arName: '2020', enName: '2020', code: '' },
    { id: 15, arName: '2021', enName: '2021', code: '' },
    { id: 16, arName: '2022', enName: '2022', code: '' },
    { id: 17, arName: '2023', enName: '2023', code: '' },
    { id: 18, arName: '2024', enName: '2024', code: '' },
  ]
  filteredActivities: IDropdownList[] = [];
  filteredCountries: IDropdownList[] = [];
  filteredSectors: IDropdownList[] = [];
  filteredCompanies: IDropdownList[] = [];
  filteredYears: IDropdownList[] = this.years;
  filteredGovernorates: IDropdownList[] = [];
  filteredWilayat: IDropdownList[] = [];
  errorMessage: string = '';
  isTableError: boolean = false;
  isYearError: boolean = false;
  isContenterror: boolean = false;
  isReportNameError: boolean = false;
  reviewType: number = 0;
  savedLang: string = '';
  lang:number = 2;
  constructor(private sharedService: SharedService, private sectorsAndActivitiesServices: SectorAndActivitiesService,
    private reportServices: ReportService, private companyService: CompanyHomeService
    , private formServices: FormService,
    private codeHomeService: CodeHomeService,
    private activeRouter: ActivatedRoute) { }
  ngOnInit(): void {
    this.reportId = this.activeRouter.snapshot.paramMap.get('reportId')!;
    this.savedLang = localStorage.getItem('language') || 'ar';
    this.lang = this.savedLang === 'ar' ? 2 : 1;
    this.GetReports();
  }
  getTotal(report: any): number {
    return report.fields.reduce((total: number, row: any) => total + (+row[0]?.value || 0), 0);
  }
  removeFilterRow(table: any, field: any) {
    // Find the matching table in tables array based on enTableName
    const tableToUpdate = this.tables.find((t: any) => t.enTableName === table.enTableName);
    if (tableToUpdate && tableToUpdate.fields && tableToUpdate.fields.length > 0) {
      // Filter out the field with matching name in the fields array of the found table
      tableToUpdate.fields = tableToUpdate.fields.filter((f: any) => f.name !== field.name);
    }

  }
  removeTable(table: any) {
    if (this.tables && this.tables.length > 0) {
      // Filter out the field with matching name in the fields array of the found table
      this.tables = this.tables.filter((f: any) => f.enTableName !== table.enTableName);
    }
  }
  GetReports(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.reports = res.Data;
        }
        else {
          res.Data = []
          this.reports = res.Data;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.reportServices.GetReportParts(0, '', +this.reportId).subscribe(observer);
  }
  getArTableNames(report: any): string {
    // Get all names except the first one
    return report.reportDetails.slice(1).map((detail: any) => detail.ArTableName).join(', ');
  }
  getReportYear(report: any): string {
    // Find the detail that includes "years" in EnTableName
    const yearDetail = report.reportDetails.find((detail: any) => detail.EnTableName && detail.EnTableName.toLowerCase().includes("years"));

    // If found, return the appropriate year or a default message
    return yearDetail ? yearDetail.year : 'غير محدد'; // Replace 'year' with the actual property that holds the year if different
  }
  getUniqueActivities(fields: any[]): any[] {
    const activities = fields
      .flat() // Flatten the array since fields is nested
      .filter(field => field.key === 'activity'); // Filter to find 'activity' key

    // Use a Set to store only unique activities
    const uniqueActivities = Array.from(new Set(activities.map(a => a.value)));

    // Map back to the format you need (returning as {key, value} objects)
    return uniqueActivities.map(activity => ({ key: 'activity', value: activity }));
  }
  getUniqueCompanies(fields: any[]): any[] {
    const activities = fields
      .flat() // Flatten the array since fields is nested
      .filter(field => field.key === 'companyName'); // Filter to find 'activity' key

    // Use a Set to store only unique activities
    const uniqueActivities = Array.from(new Set(activities.map(a => a.value)));

    // Map back to the format you need (returning as {key, value} objects)
    return uniqueActivities.map(activity => ({ key: 'companyName', value: activity }));
  }
  getUniqueSectors(fields: any[]): any[] {
    const activities = fields
      .flat() // Flatten the array since fields is nested
      .filter(field => field.key === 'sector'); // Filter to find 'activity' key

    // Use a Set to store only unique activities
    const uniqueActivities = Array.from(new Set(activities.map(a => a.value)));

    // Map back to the format you need (returning as {key, value} objects)
    return uniqueActivities.map(activity => ({ key: 'sector', value: activity }));
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleFormContentDropdown() {
    this.isFormContentDropdownOpen = !this.isFormContentDropdownOpen;
  }
  toggleActivityDropdown() {
    this.isActivityDropdownOpen = !this.isActivityDropdownOpen;
  }
  toggleCountryDropdown() {
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
  }
  toggleYearsDropdown() {
    this.isYearsDropdownOpen = !this.isYearsDropdownOpen;
  }
  toggleCompanyDropdown() {
    this.isCompanyDropdownOpen = !this.isCompanyDropdownOpen;
  }
  toggleGovernorateDropdown() {
    this.isGovernorateDropdownOpen = !this.isGovernorateDropdownOpen;
  }
  toggleWilayatDropdown() {
    this.isWilayatDropdownOpen = !this.isWilayatDropdownOpen;
  }
  toggleSectorDropdown() {
    this.isSectorDropdownOpen = !this.isYearsDropdownOpen;
  }
  filterSubCodes() {
    this.filteredCodes = this.codes.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }
  filterActivitiesRep() {
    this.filteredActivities = this.activities.filter(code =>
      code.arName.includes(this.searchActivityTerm)
    );
  }
  filterCountriesRep() {
    this.filteredCountries = this.countries.filter(code =>
      code.arName.includes(this.searchCountryTerm)
    );
  }
  filterYearsRep() {
    this.filteredYears = this.years.filter(code =>
      code.arName.includes(this.searchYearTerm)
    );
  }
  filterCompaniesRep() {

    this.filteredCompanies = this.companies.filter(code =>
      code.arName.includes(this.searchCompanyTerm)
    );
  }
  filterGovernoratesRep() {

    this.filteredGovernorates = this.governorates.filter(code =>
      code.arName.includes(this.searchGovernorateTerm)
    );
  }
  filterWilayatRep() {

    this.filteredWilayat = this.wilayat.filter(code =>
      code.arName.includes(this.searchWilayatTerm)
    );
  }
  filterSectorRep() {
    this.filteredSectors = this.sectors.filter(code =>
      code.arName.includes(this.searchSectorTerm)
    );
  }
  filterTablesRep() {
    this.filteredTables = this.tablesRep.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }
  selectCode(event: Event, table: ITableDto, code: any) {
    this.searchFormContentTerm = code.arName;
    this.isFormContentDropdownOpen = false;

    const selectedField = this.codes.find(field => field.arName === code.arName);
    if (selectedField && table) {
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);
      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          arName: selectedField.arName,
          name: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.Id // Initialize value as needed
        };
        // Check if the field already exists in the table's fields array
        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectTable(event: Event, table: ITableDto, tableRep: any) {
    this.searchTerm = tableRep.arName;
    this.isDropdownOpen = false;

    const selectedField = this.tablesRep.find(field => field.arName === tableRep.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: selectedField.Type,
          filter: selectedField.period, // Initialize as null or a valid default value
          value: selectedField.Id // Initialize value as needed
        };

        table.fields[0] = tableField;
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectActivityRep(event: Event, table: ITableDto, activity: any) {
    this.searchActivityTerm = activity.arName;
    this.isActivityDropdownOpen = false;
    const selectedField = this.activities.find(field => field.arName === activity.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);
      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectCountryRep(event: Event, table: ITableDto, country: any) {
    this.searchCountryTerm = country.arName;
    this.isCountryDropdownOpen = false;

    const selectedField = this.countries.find(field => field.arName === country.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectYearRep(event: Event, table: ITableDto, year: any) {

    this.searchYearTerm = year.arName;
    this.isYearsDropdownOpen = false;

    const selectedField = this.years.find(field => field.arName === year.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };
        if (this.tables[0].enTableName == 'TablesReport')
          table.fields[0] = tableField;
        else
          table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectCompanyRep(event: Event, table: ITableDto, company: any) {
    this.searchCompanyTerm = company.arName;
    this.isCompanyDropdownOpen = false;

    const selectedField = this.companies.find(field => field.arName === company.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectGovernorateRep(event: Event, table: ITableDto, governorate: any) {
    this.searchGovernorateTerm = governorate.arName;
    this.isGovernorateDropdownOpen = false;

    const selectedField = this.governorates.find(field => field.arName === governorate.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectWilayatRep(event: Event, table: ITableDto, wilayat: any) {
    this.searchWilayatTerm = wilayat.arName;
    this.isWilayatDropdownOpen = false;

    const selectedField = this.wilayat.find(field => field.arName === wilayat.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  selectSectorRep(event: Event, table: ITableDto, sector: any) {
    this.searchSectorTerm = sector.arName;
    this.isSectorDropdownOpen = false;

    const selectedField = this.sectors.find(field => field.arName === sector.arName);

    if (selectedField && table) {
      // Check if the field already exists in the table's fields array
      const fieldExists = table.fields.some(field => field.name === selectedField.arName);

      if (!fieldExists) {
        const tableField: ITableFieldDto = {
          name: selectedField.arName,
          arName: selectedField.arName,
          dataType: null,
          filter: null, // Initialize as null or a valid default value
          value: selectedField.id // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    // Perform any additional logic, like setting a FormControl value
  }
  DeleteReportContent(id: number): void {
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
            this.GetReports();
          },
          error: (err: any) => {

            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.reportServices.DeleteReportContent(id).subscribe(observer);
      }
    });
  }
  GetTableFields(tableType: number): void {
    if (this.tableType != 0) {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {

          if (res.Data) {
            if (tableType == 1)
              this.companyFields = res.Data
            else if (tableType == 2)
              this.formFields = res.Data
            else if (tableType == 3)
              this.researcherFields = res.Data
            else if (tableType == 4)
              this.sectorFields = res.Data
            else if (tableType == 5)
              this.activitiesFields = res.Data
            else if (tableType == 6)
              this.subActivitiesFields = res.Data
            else if (tableType == 7)
              this.governoratesFields = res.Data
            else if (tableType == 8)
              this.wilayatFields = res.Data
            else if (tableType == 9)
              this.tableFields = res.Data
          }
          this.showLoader = false;
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.reportServices.GetTableFields(tableType).subscribe(observer);
    }
  }
  onFormTypeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === '1') {
      this.currentFields = this.coverFields;
    } else if (selectedValue === '2') {
      this.currentFields = this.quarterCoverFields;
    }
  }
  GetAllCodes(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.filteredCodes = res.Data.getCodeDtos;
        }
        else {
          this.codes = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(0).subscribe(observer);
  }
  GetTables(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.tablesRep = res.Data;
          this.filteredTables = res.Data;
        }
        else {
          this.tablesRep = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.formServices.GetTables().subscribe(observer);
  }
  onTableSelect(): void {
    this.isTableError = false;
    this.isYearError = false;
    this.isReportNameError = false;
    this.reportYearFrom = undefined;
    this.reportYearTo = undefined;
    this.tables = [];
    if (this.tableType === 1) {
      // Add the 'Companies' table to tableDto
      const tableDto: ITableDto[] = [{
        selectAllFields: false,
        enTableName: 'Companies',
        arTableName: 'الشركات',
        fields: []  // Initial empty fields array
      },
      {
        selectAllFields: false,
        enTableName: 'Years',
        arTableName: 'السنوات',
        fields: []  // Initial empty fields array
      }];
      this.tables = tableDto;      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(1);
    }
    else if (this.tableType === 3) {
      const tableDto: ITableDto[] = [{
        selectAllFields: false,
        enTableName: 'Researcher',
        arTableName: 'الباحثين',
        fields: []  // Initial empty fields array
      },
      {
        selectAllFields: false,
        enTableName: 'Years',
        arTableName: 'السنوات',
        fields: []  // Initial empty fields array
      }];
      this.tables = tableDto;
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(3);
    }
    else if (this.tableType === 2) {
      const tableDto: ITableDto[] = [{
        selectAllFields: false,
        enTableName: 'Forms',
        arTableName: 'الاستمارات',
        fields: []  // Initial empty fields array
      },
      {
        selectAllFields: false,
        enTableName: 'Years',
        arTableName: 'السنوات',
        fields: []  // Initial empty fields array
      }];
      this.tables = tableDto;
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(2);
    }
    else if (this.tableType === 4) {
      const tableDto: ITableDto[] = [{
        selectAllFields: false,
        enTableName: 'FormContent',
        arTableName: 'محتوى الاستمارة',
        fields: []  // Initial empty fields array
      },
      {
        selectAllFields: false,
        enTableName: 'Years',
        arTableName: 'السنوات',
        fields: []  // Initial empty fields array
      },
      ];
      this.tables = tableDto;
      // Fetch table fields for the selected type (1 for Companies)
      this.GetAllCodes();
    }
    else if (this.tableType === 5) {
      const tableDto: ITableDto[] = [{
        selectAllFields: false,
        enTableName: 'TablesReport',
        arTableName: 'تقرير الجداول',
        fields: []  // Initial empty fields array
      },
      {
        selectAllFields: false,
        enTableName: 'Years',
        arTableName: 'السنوات',
        fields: []  // Initial empty fields array
      },
      ];
      this.tables = tableDto;

      // Fetch table fields for the selected type (1 for Companies)
      this.GetTables();
    }
  }
  onFieldSelect(event: Event | null = null, _field: string = '', table: ITableDto): void {
    let selectedValue = '';
    if (event) {
      const selectElement = event.target as HTMLSelectElement;
      selectedValue = selectElement.value;
    }
    else {
      selectedValue = _field;
    }

    if (table.enTableName == 'Companies') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.companyFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.companyFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Researcher') {

      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.researcherFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.researcherFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Sectors') {

      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.sectorFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.sectorFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Activities') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.activitiesFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.activitiesFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'SubActivities') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.subActivitiesFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.subActivitiesFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Governorates') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.governoratesFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.governoratesFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Wilayats') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.wilayatFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.wilayatFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Tables') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.tableFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.tableFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);
        if (!fieldExists) {

          if (selectedField.name === 'Order')
            selectedField.name = '[Order]'
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Forms') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.formFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.formFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'GeneralData') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.generalDataFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.generalDataFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Cover') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.coverFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.coverFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Certification') {
      let selectedField: IFieldDto | undefined;
      if (event) {
        selectedField = this.certificationFields.find(field => field.name === selectedValue);
      }
      else {
        selectedField = this.certificationFields.find(field => field.arName === selectedValue);
      }
      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField!.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            arName: selectedField.arName,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
  }
  getTranslatedName(fieldName: string, report: any): string {
    if (report.reportType === 'Companies') {

      if (this.companyFields.length === 0) {
        this.tableType = 1;
        this.GetTableFields(1);
      }
      const companyField = this.companyFields.find(
        (companyField: IFieldDto) => companyField.name === fieldName
      );

      return companyField ? companyField.arName : '';
    }
    return fieldName; // In other report types, just return the field name
  }
  openModal() {
    const modal = document.getElementById('chooseTable');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      // Check for an existing backdrop before creating a new one
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    } else {
      console.error('Modal element with id "chooseTable" not found.');
    }
  }
  closeModal() {
    const modal = document.getElementById('chooseTable');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop from the DOM
      } else {
        console.error('Backdrop not found.');
      }
    } else {
      console.error('Modal element with id "chooseTable" not found.');
    }
  }
  saveReport() {
    this.errorMessage = '';
    
    if (this.tables.length == 0) {
      this.isTableError = true;
      this.errorMessage = 'يجب تحديد جدول للتقرير'
      return;
    }
    else {
      this.isTableError = false;
      this.errorMessage = '';
    }
    if ((this.tables[1].fields.length == 0 && this.searchYearTerm == '') && this.tableType == 5) {
      this.isTableError = true;
      this.errorMessage = 'يجب تحديد سنة المسح'
      return; // Stop further execution
    }
    else {
      this.isTableError = false;
      this.errorMessage = ''
    }
    if ((!this.reportYearFrom || this.reportYearFrom === undefined) && this.tableType != 5) {
      this.isYearError = true;
      this.errorMessage = 'يجب تحديد سنة البداية'
      return; // Stop further execution
    }
    else {
      this.isYearError = false;
      this.errorMessage = '';
    }
    if ((this.reportYearFrom !== undefined && this.reportYearTo !== undefined) && this.tableType != 5) {
      if ((this.reportYearFrom ?? 0) > (this.reportYearTo ?? 0)) {
        this.isYearError = true;
        this.errorMessage = 'يجب تحديد سنة النهاية اكبر من او يساوي سنة البداية'
        return; // Stop further execution
      }
    }
    else {
      this.isYearError = false;
      this.errorMessage = '';
    }
    if (this.report.part == '' || this.report.part == null || this.report.part == undefined) {
      this.isReportNameError = true;
      this.errorMessage = 'يجب ادخال عنوان الجدول'
      return;
    }
    else {
      this.isReportNameError = false;
      this.errorMessage = '';
    }
    // if (this.tables.length > 1) {
    //   if (this.tables[1].enTableName == 'Years') {
    //     if (this.searchYearTerm == '' || this.searchYearTerm == null) {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'يجب اختيار سنة واحدة',
    //         showConfirmButton: true,
    //         confirmButtonText: 'اغلاق'
    //       });
    //       return;
    //     }
    //   }
    // }

    if (this.tables[0].fields.length == 0 && (this.tables[0].enTableName == 'FormContent')) {
      this.isContenterror = true;
      this.errorMessage = `يجب الاختيار من ${this.tables[0].arTableName}`
      return
    }
    else {
      this.isContenterror = false;
      this.errorMessage = '';
    }
    if (this.reviewType == undefined || this.reviewType == 0 && (this.tables[0].enTableName == 'FormContent' ||
      this.tables[0].enTableName == 'TablesReport' || this.tables[0].enTableName == 'Forms')) {
      this.isYearError = true;
      this.errorMessage = 'يجب اختيار نوع المسح'
      return
    }
    else {
      this.isYearError = false;
      this.errorMessage = '';
    }
    if ((this.tables[0].fields.length == 0 && this.searchTerm == '') && this.tables[0].enTableName == 'TablesReport') {
      this.isContenterror = true;
      this.errorMessage = `يجب الاختيار من ${this.tables[0].arTableName}`
      return
    }
    else {
      this.isContenterror = false;
      this.errorMessage = '';
    }
    if ((this.reportYearTo === undefined || this.reportYearTo === null) && this.tableType != 5) {
      const currentYear = new Date().getFullYear();
      for (let year = this.reportYearFrom!; year <= currentYear; year++) {
        const tableField: ITableFieldDto = {
          name: year.toString(),
          arName: year.toString(),
          dataType: '', // Use appropriate data type as needed
          filter: null,
          value: ''
        };
        this.tables[1].fields.push(tableField);
      }
    }

    // Case 2: reportYearFrom and reportYearTo both have values
    else if ((this.reportYearTo !== undefined && this.reportYearTo > this.reportYearFrom!) && this.tableType != 5) {
      for (let year = this.reportYearFrom; year! <= this.reportYearTo; year!++) {
        const tableField: ITableFieldDto = {
          name: year!.toString(),
          arName: year!.toString(),
          dataType: '', // Use appropriate data type as needed
          filter: null,
          value: ''
        };
        this.tables[1].fields.push(tableField);
      }
    }


    // Case 3: reportYearFrom and reportYearTo are equal
    if ((this.reportYearFrom === this.reportYearTo) && this.tableType != 5) {
      const tableField: ITableFieldDto = {
        name: this.reportYearFrom!.toString(),
        arName: this.reportYearFrom!.toString(),
        dataType: '', // Use appropriate data type as needed
        filter: null,
        value: ''
      };
      this.tables[1].fields.push(tableField);
    }

    // if (this.tables.length == 3) {
    //   if (this.tables[2].fields.length == 0 && (this.tables[0].enTableName == 'FormContent' || this.tables[0].enTableName == 'TablesReport')) {
    //     this.isYearError = true;
    //     this.errorMessage = `يجب الاختيار من ${this.tables[2].arTableName}`
    //     return
    //   }
    // }
    this.report.query = this.fbuildJoinQuery(this.tables, this.stringFilterItems, this.numberFilterItems);
    this.report.reportId = +this.reportId;



    // if (this.report.query == '' || this.report.query == 'SELECT    ;' || this.report.query == null || this.report.query == undefined) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'يجب تحديد جداول للتقرير',
    //     showConfirmButton: true,
    //     confirmButtonText: 'اغلاق'
    //   });
    //   return;
    // }

    if (this.tables.length > 0 && this.tables[0].enTableName !== 'FormContent' && this.tables[0].enTableName !== 'TablesReport') {
      this.tables.forEach(table => {
        // Check if the fields array is empty or needs to be filled with null data
        if (table.fields.length === 0) {
          // Add a placeholder object with null/default values
          table.fields = [{
            dataType: 'null',
            name: '',
            arName: '',
            filter: 0,
            value: 0
          }];
        }
      });
    }
    this.report.reportDetails = JSON.stringify(this.tables);

    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        this.tables = [];
        this.isReportNameError = false;
        this.reportYearFrom = undefined;
        this.reportYearTo = undefined;
        this.report = {
          part: '',
          query: '',
          reportType: '',
          seconedTable: '',
          withChart: false,  // default to false
          chartType: 0,      // default chart type
          reportId: 0,
          reportDetails: ''       // default ID
        };
        this.GetReports();
        const button = document.getElementById('close');
        if (button) {
          button.click();
        }
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
    this.reportServices.AddReportContent(this.report).subscribe(observer);
  }
  onReportYearChange() {
    if (this.isYearError)
      this.isYearError = false
  }
  onReportPartChange(newValue: string) {

    if (newValue == '') {
      this.isYearError = true
      this.errorMessage = "يجب ادخال اسم محتوىالتقرير"
    }
    else {
      this.isYearError = false
      this.errorMessage = "يجب ادخال اسم محتوىالتقرير"
    }
  }
  appendTable(): void {
    if (this.selectedTable) {

      if (this.selectedTable.enName == 'ActivitiesRep' || this.selectedTable.enName == 'Countries'
        || this.selectedTable.enName == 'SectorsRep' || this.selectedTable.enName == 'CompaniesRep'
        || this.selectedTable.enName == 'GovernoratesRep' || this.selectedTable.enName == 'WilayatRep'
      ) {
        if (this.tables.length > 2) {
          const tableDto: ITableDto = {
            selectAllFields: false,
            enTableName: this.selectedTable.enName,
            arTableName: this.selectedTable.arName,
            fields: []  // Initial empty fields array
          };
          const tableExists = this.tables.some(table => table.enTableName === this.selectedTable!.enName);
          if (!tableExists) {
            this.tables[2] = tableDto;
          } else {
            this.closeModal();
            return;
          }
        }
        else {
          const tableDto: ITableDto = {
            selectAllFields: false,
            enTableName: this.selectedTable.enName,
            arTableName: this.selectedTable.arName,
            fields: []  // Initial empty fields array
          };
          const tableExists = this.tables.some(table => table.enTableName === this.selectedTable!.enName);
          if (!tableExists) {
            this.tables.push(tableDto);
          } else {
            this.closeModal();
            return;
          }
        }
      }
      else {
        const tableDto: ITableDto = {
          selectAllFields: false,
          enTableName: this.selectedTable.enName,
          arTableName: this.selectedTable.arName,
          fields: []  // Initial empty fields array
        };

        const tableExists = this.tables.some(table => table.enTableName === this.selectedTable!.enName);
        if (!tableExists) {
          this.tables.push(tableDto);
        } else {
          this.closeModal();
          return;
        }
      }

      // Append the table only if it doesn't already exist

      const temp = this.generalDataFields

      if (this.selectedTable.enName == 'Companies')
        this.GetTableFields(1);
      else if (this.selectedTable.enName == 'Researcher')
        this.GetTableFields(3);
      else if (this.selectedTable.enName == 'Sectors')
        this.GetTableFields(4);
      else if (this.selectedTable.enName == 'Activities')
        this.GetTableFields(5);
      else if (this.selectedTable.enName == 'SubActivities')
        this.GetTableFields(6);
      else if (this.selectedTable.enName == 'Governorates')
        this.GetTableFields(7);
      else if (this.selectedTable.enName == 'Wilayats')
        this.GetTableFields(8);
      else if (this.selectedTable.enName == 'Tables')
        this.GetTableFields(9);
      else if (this.selectedTable.enName == 'Countries')
        this.GetCountries();
      else if (this.selectedTable.enName == 'ActivitiesRep')
        this.GetActivities();
      else if (this.selectedTable.enName == 'SectorsRep')
        this.GetSectors();
      else if (this.selectedTable.enName == 'CompaniesRep')
        this.GetCompanies();
      else if (this.selectedTable.enName == 'GovernoratesRep')
        this.GetGovernorates();
      else if (this.selectedTable.enName == 'WilayatRep')
        this.GetWilayat();
      this.closeModal();
    }
  }
  transformFields(fields: any[], report: any): any[] {
    // Step 1: Group the fields by 'codeArName' using reduce
    const groupedReport = Object.values(fields.reduce((acc: { [key: string]: ReportField }, fieldArray: any[]) => {
      const questionCode = fieldArray[0].value;
      const codeArName = fieldArray[1].value;
      const codeEnName = fieldArray[2].value;
      const reviewYear = fieldArray[3].value;
      const totalCodeKey = `totalCode_${reviewYear}`;
      const totalCode2Key = `totalCode2_${reviewYear}`;

      // Initialize the group if it does not exist
      if (!acc[codeArName]) {
        acc[codeArName] = {
          questionCode,
          codeArName,
          codeEnName,
          years: []
        };
      }

      // Find the totalCode and totalCode2 for the year
      const totalCode = fieldArray.find(f => f.key === totalCodeKey)?.value;
      const totalCode2 = fieldArray.find(f => f.key === totalCode2Key)?.value;

      // Add year information with totalCode and totalCode2 (if applicable)
      const yearData: any = {
        reviewYear: Number(reviewYear),
        totalCode: totalCode ? Number(totalCode) : 0
      };

      if (report.reportType === 'FormContent') {
        yearData.totalCode2 = totalCode2 ? Number(totalCode2) : 0;  // Only add totalCode2 if FormContent
      }


      // Add yearData for the respective year under the correct codeArName
      acc[codeArName].years.push(yearData);

      return acc;
    }, {}));

    // Step 2: Ensure missing years are added
    const fieldsInReport = groupedReport as ReportField[];

    // Loop through the years and ensure missing years are added with 0 for totalCode and totalCode2 (if FormContent)
    report.reportDetails[1].Fields.forEach((fieldDetail: any) => {
      fieldsInReport.forEach((field) => {
        const missingYear = Number(fieldDetail.value); // The year to check for
        const yearExists = field.years.some(year => year.reviewYear === missingYear);

        // Add the missing year if it does not exist and has a valid value
        if (!yearExists && missingYear > 0) {
          const missingYearData: any = {
            reviewYear: missingYear,
            totalCode: 0
          };
          if (report.reportType === 'FormContent') {
            missingYearData.totalCode2 = 0;  // Add totalCode2 if FormContent
          }
          field.years.push(missingYearData);
        }
      });
    });

    // Step 3: Sort the 'years' array within each field group by reviewYear
    fieldsInReport.forEach(field => {
      field.years.sort((a, b) => a.reviewYear - b.reviewYear);

      // Apply further processing if required
      field.years = [...this.processYears(report.reportDetails[1].Fields, field.years)];
    });

    // Step 4: Return the transformed report
    return fieldsInReport;
  }

  transActivityFields(fields: any[], report: any): any[] {
    // Step 1: Group the fields by 'codeArName'
    const groupedReport = Object.values(fields.reduce((acc: { [key: string]: ReportActivityField }, fieldArray: any[]) => {

      const questionCode = fieldArray[0].value;
      const codeArName = fieldArray[1].value;
      const codeEnName = fieldArray[2].value;
      const reviewYear = fieldArray[3].value;
      const activityArName = fieldArray[4].value;
      let activityCode = fieldArray[6].value;
      const totalCodeKey = `totalCode_${reviewYear}`;
      const totalCode = fieldArray.find(f => f.key === totalCodeKey)?.value;
      if (report.seconedTable == 'GovernoratesRep' || report.seconedTable == 'WilayatRep')
        activityCode = fieldArray[5].value;
      // استخدم مفتاح مركب يجمع بين codeArName و activityCode
      const compositeKey = `${codeArName}_${activityCode}`;

      // تحقق من وجود المجموعة في acc
      if (!acc[compositeKey]) {
        acc[compositeKey] = {
          questionCode,
          codeArName,
          codeEnName,
          activityArName,
          activityCode,
          years: []
        };
      }

      // أضف السنة و totalCode إذا كانت موجودة
      if (totalCode) {
        acc[compositeKey].years.push({
          reviewYear: Number(reviewYear),
          totalCode: Number(totalCode)
        });
      }

      return acc;
    }, {}));


    // Step 2: Append missing years from report.reportDetails[1].Fields with a value of 0
    let fieldsInReport = groupedReport as ReportField[];

    // Define the years range to add (e.g., 2021, 2022)
    // Use inline type annotation for fieldDetail
    report.reportDetails[1].Fields.forEach((fieldDetail: any) => {
      fieldsInReport.forEach((field) => {
        const yearExists = field.years.some(year => year.reviewYear === Number(fieldDetail.arName));

        // Check if the year exists, and if not, add it
        if (!yearExists) {
          const missingYear = Number(fieldDetail.value);
          // Avoid adding '0' and only add years in 'yearsToAdd' if they don't already exist
          if (missingYear > 0 && !field.years.some(year => year.reviewYear === missingYear)) {
            field.years.push({
              reviewYear: missingYear,
              totalCode: 0
            });
          }
        }
      });
    });
    // Step 3: Ensure the years array is sorted by 'reviewYear'
    fieldsInReport.forEach(field => {
      field.years.sort((a, b) => a.reviewYear - b.reviewYear);

      field.years = [...this.processYears(report.reportDetails[1].Fields, field.years)];

    });

    // Step 4: Return the transformed report
    return fieldsInReport;
  }
  processYears(yearsWithoutValues: any[], yearsWithValues: any[]): any[] {
    // إنشاء نسخة جديدة من yearsWithoutValues لتجنب التأثير على المصدر الأصلي
    const updatedYears = yearsWithoutValues.map(year => ({ ...year }));

    const yearsWithValuesMap = new Map<number, number>();
    yearsWithValues.forEach(item => yearsWithValuesMap.set(item.reviewYear, item.totalCode));

    updatedYears.forEach(year => {
      if (yearsWithValuesMap.has(Number(year.name))) {
        year.value = yearsWithValuesMap.get(Number(year.name)) || 0;
      } else {
        year.value = 0;
      }
    });

    return updatedYears.sort((a, b) => Number(a.name) - Number(b.name));
  }
  getColumnTotals(fields: any[][], report: any): { year: string, total: number }[] {
    const totals: { [key: string]: number } = {};

    // جمع الإجماليات لجميع السنوات من fields
    fields.forEach(fieldArray => {
      const reviewYear = fieldArray.find(f => f.key === 'reviewYear')?.value;
      const totalCodeKey = `totalCode_${reviewYear}`;
      const totalCode = Number(fieldArray.find(f => f.key === totalCodeKey)?.value || 0);

      if (reviewYear) {
        totals[reviewYear] = (totals[reviewYear] || 0) + totalCode;
      }
    });

    // إضافة السنوات التي لا تحتوي على قيم
    report.reportDetails[1].Fields.forEach((year: any) => {
      const yearName = year.name;
      const totalValue = year.value || 0;  // القيمة 0 في حال لم تكن موجودة في yearsWithValues
      totals[yearName] = (totals[yearName] || 0) + totalValue;
    });

    // ترتيب الإجماليات حسب السنة
    const sortedTotals = Object.entries(totals)
      .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))  // ترتيب حسب السنة
      .map(([year, total]) => ({ year, total }));

    return sortedTotals;
  }
  fbuildJoinQuery(tables: ITableDto[], stringFilterItems: IReportFilterDto[], numberFilterItems: IReportFilterDto[]): string {
    this.report.reportType = tables[0].enTableName;

    if (tables[0].enTableName != 'FormContent' && tables[0].enTableName != 'TablesReport') {
      let query = 'SELECT ';
      let joins = '';
      let fromTable = '';
      let fields = '';
      let whereClause = '';

      tables.forEach((table, tableIndex) => {

        if (table.enTableName != 'Years') {
          const tableAlias = `${table.enTableName}`;
          // Determine if all fields should be selected

          if (table.selectAllFields || table.fields.length === 0) {
            if (table.enTableName == 'Companies') {
              this.companyFields.forEach((companyField, companyFieldIndex) => {
                this.onFieldSelect(null, companyField.arName, table);
              });
            }
            if (table.enTableName == 'Forms') {
              this.formFields.forEach((companyField, companyFieldIndex) => {
                this.onFieldSelect(null, companyField.arName, table);
              });
            }
            if (table.enTableName == 'Researcher') {
              this.researcherFields.forEach((researcherField, researcherFieldIndex) => {
                this.onFieldSelect(null, researcherField.arName, table);
              });
            }
            if (table.enTableName == 'Sectors') {
              this.sectorFields.forEach((sectorField, sectorFieldIndex) => {
                this.onFieldSelect(null, sectorField.arName, table);
              });
            }
            if (table.enTableName == 'Activities') {
              this.activitiesFields.forEach((activitiesField, activitiesFieldIndex) => {
                this.onFieldSelect(null, activitiesField.arName, table);
              });
            }
            if (table.enTableName == 'SubActivities') {
              this.subActivitiesFields.forEach((subActivitiesField, subActivitiesFieldIndex) => {
                this.onFieldSelect(null, subActivitiesField.arName, table);
              });
            }
            if (table.enTableName == 'Governorates') {
              this.governoratesFields.forEach((govenoratesField, govenoratesFieldIndex) => {
                this.onFieldSelect(null, govenoratesField.arName, table);
              });
            }
            if (table.enTableName == 'Wilayats') {
              this.wilayatFields.forEach((wilayatField, wilayatFieldIndex) => {
                this.onFieldSelect(null, wilayatField.arName, table);
              });
            }
            if (table.enTableName == 'Tables') {
              this.tableFields.forEach((tablesField, tableFieldIndex) => {
                this.onFieldSelect(null, tablesField.arName, table);
              });
            }
          }
          // Select the fields for each table if fields are defined
          table.fields.forEach((field, fieldIndex) => {
            if (field.name != '[Order]')
              fields += `${tableAlias}.${field.name} AS ${table.enTableName}_${field.name}`;
            else
              fields += `${tableAlias}.[Order] AS ${table.enTableName}_Order`;

            // Add a comma if not the last field of the last table

            if (tables.length == 3) {
              if (fieldIndex !== table.fields.length - 1 || tableIndex !== tables.length - 1) {
                fields += ', ';
              }
            }
            else {
              if (fieldIndex !== table.fields.length - 1 && tableIndex !== tables.length) {
                fields += ', ';
              }
            }
            // Only build WHERE condition if both value and filter are present

          });

          table.fields.forEach((field, fieldIndex) => {

            if (field.value !== null && field.value !== '' && field.filter !== null) {
              let filterItem;

              // Use appropriate filter for string or number data type
              if (field.dataType === 'String') {
                filterItem = stringFilterItems.find(f => f.id === field.filter);
              } else {
                filterItem = numberFilterItems.find(f => f.id === field.filter);
              }

              if (filterItem) {
                let conditionValue = field.value;

                // Add single quotes and N prefix for non-int32 fields (e.g., strings)
                if (field.dataType !== 'Int32') {
                  conditionValue = `N'${field.value}'`;
                }

                const condition = `${tableAlias}.${field.name} ${filterItem.enName} ${conditionValue}`;

                whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
              }
            }
          });
          // Ensure a comma between * and other fields, but only if it's not the last table
          if (tableIndex !== tables.length - 1 && (table.selectAllFields && table.fields.length === 0)) {
            fields += ', ';
          }
          // Construct the FROM and JOIN part of the query
          if (tableIndex === 0) {
            fromTable = `FROM ${table.enTableName} ${tableAlias}`;
          } else if (tableIndex != 0 && tables.length > 2) {
            switch (table.enTableName) {
              case 'Companies':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON Companies.researcherId = ${tables[0].enTableName}.id`;
                break;
              case 'Researcher':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.researcherId = ${tableAlias}.id `;
                break;
              case 'Sectors':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.sectorId = ${tableAlias}.id `;
                break;
              case 'Activities':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.activityId = ${tableAlias}.id `;
                break;
              case 'SubActivities':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.subActivityId = ${tableAlias}.id `;
                break;
              case 'Governorates':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.governoratesId = ${tableAlias}.id `;
                break;
              case 'Wilayats':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.wilayatId = ${tableAlias}.id `;
                break;
              case 'Tables':
                joins += ` JOIN ${table.enTableName} ${tableAlias} ON ${tables[0].enTableName}.id = ${tableAlias}.formId `;
                break;
              default:
                throw new Error(`Unknown table: ${table.enTableName}`);
            }
          }
        }
      });

      if (tables[0].enTableName == 'Companies') {
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause = whereClause === '' ? `where YEAR(Companies.CreatedOn) = ${this.reportYearFrom}` : whereClause + ` and YEAR(Companies.CreatedOn) = ${this.reportYearFrom}`
          } else {
            whereClause = whereClause === '' ? `where YEAR(Companies.CreatedOn) >= ${this.reportYearFrom} AND YEAR(Companies.CreatedOn) <= ${this.reportYearTo}` : whereClause + ` AND YEAR(Companies.CreatedOn) >= ${this.reportYearFrom} AND YEAR(Companies.CreatedOn) <= ${this.reportYearTo}`
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause = whereClause === '' ? `where YEAR(Companies.CreatedOn) >= ${this.reportYearFrom}` : whereClause + ` AND YEAR(Companies.CreatedOn) >= ${this.reportYearFrom}`
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause = whereClause === '' ? `where YEAR(Companies.CreatedOn) <= ${this.reportYearTo}` : whereClause + ` AND YEAR(Companies.CreatedOn) <= ${this.reportYearTo}`
        }
      }
      else if (tables[0].enTableName == 'Researcher') {
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause = whereClause === '' ? `where YEAR(Researcher.CreatedOn) = ${this.reportYearFrom}` : whereClause + ` and YEAR(Researcher.CreatedOn) = ${this.reportYearFrom}`
          } else {
            whereClause = whereClause === '' ? `where YEAR(Researcher.CreatedOn) >= ${this.reportYearFrom} AND YEAR(Researcher.CreatedOn) <= ${this.reportYearTo}` : whereClause + ` AND YEAR(Researcher.CreatedOn) >= ${this.reportYearFrom} AND YEAR(Researcher.CreatedOn) <= ${this.reportYearTo}`
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause = whereClause === '' ? `where YEAR(Researcher.CreatedOn) >= ${this.reportYearFrom}` : whereClause + ` AND YEAR(Researcher.CreatedOn) >= ${this.reportYearFrom}`
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause = whereClause === '' ? `where YEAR(Researcher.CreatedOn) <= ${this.reportYearTo}` : whereClause + ` AND YEAR(Researcher.CreatedOn) <= ${this.reportYearTo}`
        }
      }
      else if (tables[0].enTableName == 'Forms') {
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause = whereClause === '' ? `where Forms.reviewYear = ${this.reportYearFrom} and Forms.type = ${this.reviewType}` : whereClause + ` and Forms.reviewYear = ${this.reportYearFrom} and Forms.type = ${this.reviewType}`
          } else {
            whereClause = whereClause === '' ? `where Forms.reviewYear >= ${this.reportYearFrom} AND Forms.reviewYear <= ${this.reportYearTo} and Forms.type = ${this.reviewType}` : whereClause + ` AND Forms.reviewYear >= ${this.reportYearFrom} AND Forms.reviewYear <= ${this.reportYearTo} and Forms.type = ${this.reviewType}`
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause = whereClause === '' ? `where Forms.reviewYear >= ${this.reportYearFrom} and Forms.type = ${this.reviewType}` : whereClause + ` AND Forms.reviewYear >= ${this.reportYearFrom} and Forms.type = ${this.reviewType}`
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause = whereClause === '' ? `where Forms.reviewYear <= ${this.reportYearTo} and Forms.type = ${this.reviewType}` : whereClause + ` AND Forms.reviewYear <= ${this.reportYearTo} and Forms.type = ${this.reviewType}`
        }
      }
      // Final query with SELECT, FROM, JOIN, and WHERE
      query = `SELECT ${fields} ${fromTable} ${joins} ${whereClause};`;

      return query;
    }
    else if (tables[0].enTableName == 'TablesReport') {
      return this.createYearRepQuery(tables);
    }
    else if (tables[0].enTableName == 'FormContent') {
      return this.createFormContentQuery(tables);
    }
    else {
      return '';
    }
  }
  createFormContentQuery(tables: ITableDto[]): string {
    let query = '';

    if (tables.length == 3) {
      this.report.seconedTable = tables[2].enTableName;
      if (tables[2].enTableName == 'ActivitiesRep') {
        query = this.activityFilterQuery(tables, 1);
      }
      else if (tables[2].enTableName == 'CompaniesRep') {
        query = this.companyFilterQuery(tables, 1);
      }
      else if (tables[2].enTableName == 'SectorsRep') {
        query = this.sectorFilterQuery(tables, 1);
      }
      else if (tables[2].enTableName == 'Countries') {
        query = this.countryFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'GovernoratesRep') {
        query = this.governorateFilterQuery(tables, 1);
      }
      else if (tables[2].enTableName == 'WilayatRep') {
        query = this.wilayatFilterQuery(tables, 1);
      }
      return query;
    }
    else {
      this.report.seconedTable = tables[1].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL)`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }
      // if (this.searchFormContentTerm && this.searchFormContentTerm != '' && this.searchFormContentTerm != null) {
      //   whereClause += ` WHERE JSON_VALUE(j.value, '$.arName') = N'${this.searchFormContentTerm}' AND JSON_VALUE(j.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) AND (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL)`;
      // }

      // Handle conditions based on tables[1] (Years)
      // if (tables.length > 1 && tables[1].enTableName == 'Years') {
      //   if (tables[1].fields && tables[1].fields.length > 0) {
      //     tables[1].fields.forEach((field, fieldIndex) => {
      //       if (field.name) {
      //         // Add the condition for f.reviewYear
      //         const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

      //         // Append this to the whereClause as well
      //         whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
      //       }
      //     });
      //   }
      // }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear, JSON_VALUE(j.value, '$.arName'),JSON_VALUE(j.value, '$.codes[0]') `
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  createYearRepQuery(tables: ITableDto[]): string {
    let query = ''

    if (tables.length == 3) {
      this.report.seconedTable = tables[2].enTableName;
      if (tables[2].enTableName == 'ActivitiesRep') {
        query = this.activityFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'CompaniesRep') {
        query = this.companyFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'SectorsRep') {
        query = this.sectorFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'Countries') {
        query = this.countryFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'GovernoratesRep') {
        query = this.governorateFilterQuery(tables);
      }
      else if (tables[2].enTableName == 'WilayatRep') {
        query = this.wilayatFilterQuery(tables);
      }
      return query;
    }
    else {
      this.report.seconedTable = tables[1].enTableName;

      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }

      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType,t.period as tablePeriod FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`;
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }

      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          // tables[1].fields.forEach((field, fieldIndex) => {
          //   if (field.name) {
          //     // Add the condition for f.reviewYear
          //     const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

          //     // Append this to the whereClause as well
          //     whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
          //   }
          // });
          if (this.searchYearTerm !== '') {
            // Add the condition for f.reviewYear
            const reviewYearCondition = `f.reviewYear = N'${this.searchYearTerm}'`;

            // Append this to the whereClause as well
            whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
          }
        }
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear, f.arName, t.arName,t.type;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  activityFilterQuery(tables: ITableDto[], isFormContentRep: number = 0): string {
    if (isFormContentRep == 1) {
      let query = ''
      this.report.seconedTable = tables[2].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear,ac.arName as activityArName , ac.enName as activityEnName, ac.code as activityCode FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId inner join formDatas fd on f.id = fd.FormId inner join companies c on c.UserId = fd.UserId inner join activities ac on ac.id = c.activityId`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL) and (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL) AND (c.IsDeleted != 1 OR c.IsDeleted IS NULL) AND (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) and f.type = ${this.reviewType}`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }
      if (tables.length > 1 && tables[2].enTableName === 'ActivitiesRep') {
        if (tables[2].fields && tables[2].fields.length > 0) {
          // Prepare an array to hold all activity conditions
          const activityConditions: string[] = tables[2].fields
            .filter(field => field.name)
            .map(field => `ac.arName = N'${field.name}'`);

          // Join all activity conditions with OR
          const combinedActivityCondition = activityConditions.length > 0 ? `(${activityConditions.join(" OR ")})` : "";

          // Append to whereClause
          if (combinedActivityCondition) {
            whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
          }
        }
        else {
          // Use filteredActivities.arName
          if (this.filteredActivities && this.filteredActivities.length > 0) {
            const activityConditions: string[] = this.filteredActivities
              .filter(activity => activity.arName)
              .map(activity => `ac.arName = N'${activity.arName}'`);

            // Join all activity conditions with OR
            const combinedActivityCondition = activityConditions.length > 0 ? `(${activityConditions.join(" OR ")})` : "";

            // Append to whereClause
            if (combinedActivityCondition) {
              whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
            }
          }
        }
      }

      // Final query with WHERE clause
      // let group = ` GROUP BY ac.arName,JSON_VALUE(j.value, '$.arName'),ac.code,f.reviewyear`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
    else {
      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }
      let query = ''
      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType,t.period as tablePeriod FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,ac.arName as activityName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      // if (tables[0].fields && tables[0].fields.length > 0) {
      //   tables[0].fields.forEach((field, fieldIndex) => {
      //     if (field.name) {
      //       // Build the condition for arName
      //       const condition = `t.arName = N'${field.name}'`;

      //       // Append condition to whereClause
      //       whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
      //     }
      //   });
      // }
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and (c.IsDeleted != 1 OR c.IsDeleted IS NULL) and (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }
      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          tables[1].fields.forEach((field, fieldIndex) => {
            if (field.name) {
              // Add the condition for f.reviewYear
              const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

              // Append this to the whereClause as well
              whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
            }
          });
        }
      }
      if (tables[2].fields && tables[2].fields.length > 0) {
        let whereActivity = '';
        tables[2].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const activityCondition = `ac.arName = N'${field.name}'`;


            whereActivity += whereActivity ? ` or ${activityCondition}` : ` AND (${activityCondition}`;
            // Append this to the whereClause as well
          }
        });
        whereClause += `${whereActivity})`;
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  companyFilterQuery(tables: ITableDto[], isFormContentRep: number = 0): string {
    if (isFormContentRep == 1) {
      let query = ''
      this.report.seconedTable = tables[2].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear,c.arName as companyArName , c.enName as companyEnName , ac.code FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId inner join formDatas fd on f.id = fd.FormId inner join companies c on c.UserId = fd.UserId inner join activities ac on ac.id = c.activityId`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL) and (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL) AND (c.IsDeleted != 1 OR c.IsDeleted IS NULL) AND (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) and f.type = ${this.reviewType}`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }

      if (tables.length > 1 && tables[2].enTableName === 'CompaniesRep') {
        if (tables[2].fields && tables[2].fields.length > 0) {
          // Collect conditions for each field name in an array
          const companyConditions: string[] = tables[2].fields
            .filter(field => field.name)  // Only include fields with a name
            .map(field => `c.arName = N'${field.name}'`);

          // Join all conditions with OR and wrap in parentheses for clarity
          const combinedCompanyCondition = companyConditions.length > 0 ? `(${companyConditions.join(" OR ")})` : "";

          // Append the combined condition to whereClause
          if (combinedCompanyCondition) {
            whereClause += whereClause ? ` and ${combinedCompanyCondition}` : ` WHERE ${combinedCompanyCondition}`;
          }
        }
        else {
          // Use filteredCompanies.arName
          if (this.filteredCompanies && this.filteredCompanies.length > 0) {
            const companyConditions: string[] = this.filteredCompanies
              .filter(company => company.arName)
              .map(company => `c.arName = N'${company.arName}'`);

            // Join all activity conditions with OR
            const combinedActivityCondition = companyConditions.length > 0 ? `(${companyConditions.join(" OR ")})` : "";

            // Append to whereClause
            if (combinedActivityCondition) {
              whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
            }
          }
        }
      }

      // Final query with WHERE clause
      // let group = ` GROUP BY JSON_VALUE(j.value, '$.arName'),co.arName,f.reviewyear,ac.arName,ac.code`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
    else {
      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }
      let query = ''
      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType,t.period FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,c.arName as companyName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      // if (tables[0].fields && tables[0].fields.length > 0) {
      //   tables[0].fields.forEach((field, fieldIndex) => {
      //     if (field.name) {
      //       // Build the condition for arName
      //       const condition = `t.arName = N'${field.name}'`;

      //       // Append condition to whereClause
      //       whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
      //     }
      //   });
      // }
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and (c.IsDeleted != 1 OR c.IsDeleted IS NULL) and (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }
      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          tables[1].fields.forEach((field, fieldIndex) => {
            if (field.name) {
              // Add the condition for f.reviewYear
              const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

              // Append this to the whereClause as well
              whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
            }
          });
        }
      }
      if (tables[2].fields && tables[2].fields.length > 0) {
        let whereCompany = '';
        tables[2].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const companyCondition = `c.arName = N'${field.name}'`;


            whereCompany += whereCompany ? ` or ${companyCondition}` : ` AND (${companyCondition}`;
            // Append this to the whereClause as well
          }
        });
        whereClause += `${whereCompany})`;
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  sectorFilterQuery(tables: ITableDto[], isFormContentRep: number = 0): string {
    if (isFormContentRep == 1) {
      let query = ''
      this.report.seconedTable = tables[2].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear,s.arName as sectorArName , s.enName as sectorEnName ,s.code as sectorCode FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId inner join formDatas fd on f.id = fd.FormId inner join companies c on c.UserId = fd.UserId inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id = g.sectionId inner join sectors s on s.id = sec.sectorId`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL) and (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL) AND (c.IsDeleted != 1 OR c.IsDeleted IS NULL) AND (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) AND (cat.IsDeleted != 1 OR cat.IsDeleted IS NULL) AND (g.IsDeleted != 1 OR g.IsDeleted IS NULL) AND (sec.IsDeleted != 1 OR sec.IsDeleted IS NULL) AND (s.IsDeleted != 1 OR s.IsDeleted IS NULL) and f.type = ${this.reviewType}`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }
      if (tables.length > 1 && tables[2].enTableName === 'SectorsRep') {
        if (tables[2].fields && tables[2].fields.length > 0) {
          // Collect conditions for each field name in an array
          const sectorConditions: string[] = tables[2].fields
            .filter(field => field.name)  // Only include fields with a name
            .map(field => `s.arName = N'${field.name}'`);

          // Join all conditions with OR and wrap in parentheses for clarity
          const combinedSectorCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

          // Append the combined condition to whereClause
          if (combinedSectorCondition) {
            whereClause += whereClause ? ` and ${combinedSectorCondition}` : ` WHERE ${combinedSectorCondition}`;
          }
        }
        else {
          // Use filteredSectors.arName
          if (this.filteredSectors && this.filteredSectors.length > 0) {
            const sectorConditions: string[] = this.filteredSectors
              .filter(activity => activity.arName)
              .map(activity => `s.arName = N'${activity.arName}'`);

            // Join all activity conditions with OR
            const combinedActivityCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

            // Append to whereClause
            if (combinedActivityCondition) {
              whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
            }
          }
        }
      }

      // Final query with WHERE clause
      // let group = ` GROUP BY s.arName,s.code,f.reviewyear,JSON_VALUE(j.value, '$.arName')`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
    else {
      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }
      let query = ''
      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType,t.period FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,s.arName as sectionName,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join activities ac on ac.id = c.activityId inner join categories cat on ac.categoryId = cat.id inner join groups g on g.id = cat.groupId inner join section sec on sec.id =g.sectionid inner join sectors s on s.id = sec.sectorId`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      // if (tables[0].fields && tables[0].fields.length > 0) {
      //   tables[0].fields.forEach((field, fieldIndex) => {
      //     if (field.name) {
      //       // Build the condition for arName
      //       const condition = `t.arName = N'${field.name}'`;

      //       // Append condition to whereClause
      //       whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
      //     }
      //   });
      // }
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and (c.IsDeleted != 1 OR c.IsDeleted IS NULL) and (ac.IsDeleted != 1 OR ac.IsDeleted IS NULL) and (cat.IsDeleted != 1 OR cat.IsDeleted IS NULL) and (g.IsDeleted != 1 OR g.IsDeleted IS NULL) and (sec.IsDeleted != 1 OR sec.IsDeleted IS NULL) and (s.IsDeleted != 1 OR s.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }
      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          tables[1].fields.forEach((field, fieldIndex) => {
            if (field.name) {
              // Add the condition for f.reviewYear
              const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

              // Append this to the whereClause as well
              whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
            }
          });
        }
      }
      if (tables[2].fields && tables[2].fields.length > 0) {
        let whereCompany = '';
        tables[2].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const companyCondition = `s.arName = N'${field.name}'`;


            whereCompany += whereCompany ? ` or ${companyCondition}` : ` AND (${companyCondition}`;
            // Append this to the whereClause as well
          }
        });
        whereClause += `${whereCompany})`;
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  governorateFilterQuery(tables: ITableDto[], isFormContentRep: number = 0): string {
    if (isFormContentRep == 1) {
      let query = ''
      this.report.seconedTable = tables[2].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear,g.arName governorateName , g.code as govCode FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId inner join formDatas fd on f.id = fd.FormId inner join companies c on c.UserId = fd.UserId inner join governorates g on g.id = c.governoratesid`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL) and (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL) AND (c.IsDeleted != 1 OR c.IsDeleted IS NULL) AND (g.IsDeleted != 1 OR g.IsDeleted IS NULL) and f.type = ${this.reviewType}`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }
      if (tables.length > 1 && tables[2].enTableName === 'GovernoratesRep') {
        if (tables[2].fields && tables[2].fields.length > 0) {
          // Collect conditions for each field name in an array
          const sectorConditions: string[] = tables[2].fields
            .filter(field => field.name)  // Only include fields with a name
            .map(field => `g.arName = N'${field.name}'`);

          // Join all conditions with OR and wrap in parentheses for clarity
          const combinedSectorCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

          // Append the combined condition to whereClause
          if (combinedSectorCondition) {
            whereClause += whereClause ? ` and ${combinedSectorCondition}` : ` WHERE ${combinedSectorCondition}`;
          }
        }
        else {
          // Use filteredSectors.arName
          if (this.filteredSectors && this.filteredSectors.length > 0) {
            const sectorConditions: string[] = this.filteredSectors
              .filter(activity => activity.arName)
              .map(activity => `g.arName = N'${activity.arName}'`);

            // Join all activity conditions with OR
            const combinedActivityCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

            // Append to whereClause
            if (combinedActivityCondition) {
              whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
            }
          }
        }
      }

      // Final query with WHERE clause
      // let group = ` GROUP BY s.arName,s.code,f.reviewyear,JSON_VALUE(j.value, '$.arName')`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
    else {

      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }
      let query = ''
      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType ,t.period FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,g.arName as governorateName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join governorates g on c.governoratesId = g.id`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      // if (tables[0].fields && tables[0].fields.length > 0) {
      //   tables[0].fields.forEach((field, fieldIndex) => {
      //     if (field.name) {
      //       // Build the condition for arName
      //       const condition = `t.arName = N'${field.name}'`;

      //       // Append condition to whereClause
      //       whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
      //     }
      //   });
      // }
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and (c.IsDeleted != 1 OR c.IsDeleted IS NULL) and (g.IsDeleted != 1 OR g.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }
      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          tables[1].fields.forEach((field, fieldIndex) => {
            if (field.name) {
              // Add the condition for f.reviewYear
              const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

              // Append this to the whereClause as well
              whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
            }
          });
        }
      }
      if (tables[2].fields && tables[2].fields.length > 0) {
        let whereCompany = '';
        tables[2].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const companyCondition = `g.arName = N'${field.name}'`;


            whereCompany += whereCompany ? ` or ${companyCondition}` : ` AND (${companyCondition}`;
            // Append this to the whereClause as well
          }
        });
        whereClause += `${whereCompany})`;
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  wilayatFilterQuery(tables: ITableDto[], isFormContentRep: number = 0): string {
    if (isFormContentRep == 1) {
      let query = ''
      this.report.seconedTable = tables[2].enTableName;
      query = `SELECT distinct codes.questionCode,codes.arName as codeArName,codes.enName as codeEnName ,f.reviewYear,w.arName wilayatName , w.code as wilayatCode FROM codes inner join formContents fc on fc.codeid = codes.id inner join tables t on t.id = fc.tableId inner join forms f on f.id = t.formId inner join formDatas fd on f.id = fd.FormId inner join companies c on c.UserId = fd.UserId inner join wilayats w on w.id = c.wilayatid`; // or any other filters
      let whereClause = '';
      // Handle fields from tables[0]
      if (tables[0].fields && tables[0].fields.length > 0) {
        whereClause = ` WHERE (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) and (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) and(t.IsDeleted != 1 OR t.IsDeleted IS NULL) and (f.IsDeleted != 1 OR f.IsDeleted IS NULL) and (fd.IsDeleted != 1 OR fd.IsDeleted IS NULL) AND (c.IsDeleted != 1 OR c.IsDeleted IS NULL) AND (w.IsDeleted != 1 OR w.IsDeleted IS NULL) and f.type = ${this.reviewType}`
        const fieldConditions = tables[0].fields
          .filter(field => field.name) // Filter out fields that don't have a name
          .map(field => `codes.arName = N'${field.name}'`) // Map the fields to conditions
          .join(' OR '); // Join the conditions with 'OR'

        if (fieldConditions) {
          whereClause += ` AND (${fieldConditions})`; // Append the field conditions to the WHERE clause
        }

        // Check if reportYearFrom and reportYearTo have values and filter on f.reviewYear
        if (this.reportYearFrom && this.reportYearTo) {
          if (this.reportYearFrom === this.reportYearTo) {
            whereClause += ` AND f.reviewYear = ${this.reportYearFrom}`;
          } else {
            whereClause += ` AND f.reviewYear >= ${this.reportYearFrom} AND f.reviewYear <= ${this.reportYearTo}`;
          }
        } else if (this.reportYearFrom && !this.reportYearTo) {
          whereClause += ` AND f.reviewYear >= ${this.reportYearFrom}`;
        } else if (!this.reportYearFrom && this.reportYearTo) {
          whereClause += ` AND f.reviewYear <= ${this.reportYearTo}`;
        }
      }
      if (tables.length > 1 && tables[2].enTableName === 'WilayatRep') {
        if (tables[2].fields && tables[2].fields.length > 0) {
          // Collect conditions for each field name in an array
          const sectorConditions: string[] = tables[2].fields
            .filter(field => field.name)  // Only include fields with a name
            .map(field => `w.arName = N'${field.name}'`);

          // Join all conditions with OR and wrap in parentheses for clarity
          const combinedSectorCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

          // Append the combined condition to whereClause
          if (combinedSectorCondition) {
            whereClause += whereClause ? ` and ${combinedSectorCondition}` : ` WHERE ${combinedSectorCondition}`;
          }
        }
        else {
          // Use filteredSectors.arName
          if (this.filteredSectors && this.filteredSectors.length > 0) {
            const sectorConditions: string[] = this.filteredSectors
              .filter(activity => activity.arName)
              .map(activity => `w.arName = N'${activity.arName}'`);

            // Join all activity conditions with OR
            const combinedActivityCondition = sectorConditions.length > 0 ? `(${sectorConditions.join(" OR ")})` : "";

            // Append to whereClause
            if (combinedActivityCondition) {
              whereClause += whereClause ? ` and ${combinedActivityCondition}` : ` WHERE ${combinedActivityCondition}`;
            }
          }
        }
      }

      // Final query with WHERE clause
      // let group = ` GROUP BY s.arName,s.code,f.reviewyear,JSON_VALUE(j.value, '$.arName')`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
    else {

      if (tables[0].fields.length == 0) {
        const tableField: ITableFieldDto = {
          name: this.searchTerm,
          arName: '',
          dataType: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.Type,
          filter: null, // Initialize as null or a valid default value
          value: (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id // Initialize value as needed
        };
        tables[0].fields[0] = tableField
      }
      let query = ''
      if (tables[0].fields[0].dataType == '0')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '1')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '2')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '3')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '4')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '5')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType ,t.period FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '6')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      else if (tables[0].fields[0].dataType == '7')
        query = `SELECT distinct(codes.QuestionCode) AS questionCode,codes.arName AS codeName,w.arName as wilayaeName ,t.id as tableId, f.id as formId,f.reviewYear,t.arName AS tablesName,t.type As tableType  FROM formContents fc INNER JOIN codes ON codes.id = fc.codeid INNER JOIN Tables t ON t.id = fc.tableId INNER JOIN forms f ON f.id = t.formId inner join CompanyForms cf on cf.formId = f.id inner join companies c on c.id = cf.companyid inner join wilayats w on c.wilayatId = w.id`; // or any other filters
      let whereClause = '';

      // Handle fields from tables[0]
      // if (tables[0].fields && tables[0].fields.length > 0) {
      //   tables[0].fields.forEach((field, fieldIndex) => {
      //     if (field.name) {
      //       // Build the condition for arName
      //       const condition = `t.arName = N'${field.name}'`;

      //       // Append condition to whereClause
      //       whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
      //     }
      //   });
      // }
      if (tables[0].fields && tables[0].fields.length > 0) {
        if (this.searchTerm && this.searchTerm != '' && this.searchTerm != null) {
          const id = (this.filteredTables.find(table => table.arName === this.searchTerm) as any)?.id;
          whereClause += ` WHERE t.id = N'${id}' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (fc.IsDeleted != 1 OR fc.IsDeleted IS NULL) AND (codes.IsDeleted != 1 OR codes.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND (cf.IsDeleted != 1 OR cf.IsDeleted IS NULL) and (c.IsDeleted != 1 OR c.IsDeleted IS NULL) and (w.IsDeleted != 1 OR w.IsDeleted IS NULL) and f.type = ${this.reviewType}`;
        }
      }
      // Handle conditions based on tables[1] (Years)
      if (tables.length > 1 && tables[1].enTableName == 'Years') {
        if (tables[1].fields && tables[1].fields.length > 0) {
          tables[1].fields.forEach((field, fieldIndex) => {
            if (field.name) {
              // Add the condition for f.reviewYear
              const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

              // Append this to the whereClause as well
              whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
            }
          });
        }
      }
      if (tables[2].fields && tables[2].fields.length > 0) {
        let whereCompany = '';
        tables[2].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const companyCondition = `w.arName = N'${field.name}'`;


            whereCompany += whereCompany ? ` or ${companyCondition}` : ` AND (${companyCondition}`;
            // Append this to the whereClause as well
          }
        });
        whereClause += `${whereCompany})`;
      }
      // Final query with WHERE clause
      // let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
      // query += whereClause + group;
      query += whereClause;
      return query;
    }
  }
  countryFilterQuery(tables: ITableDto[]): string {
    let query = ''
    if (tables[0].fields[0].dataType == '0')
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,SUM(CAST(JSON_VALUE(c.value, '$.codes[0]') AS INT)) AS totalCodeValue1,SUM(CAST(JSON_VALUE(c.value, '$.codes[1]') AS INT)) AS totalCodeValue2,SUM(CAST(JSON_VALUE(c.value, '$.codes[2]') AS INT)) AS totalCodeValue3, t.type As tableType,ac.arName as activity FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    else if (tables[0].fields[0].dataType == '1')
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,SUM(CAST(JSON_VALUE(c.value, '$.codes[0]') AS INT)) AS totalCodeValue1,SUM(CAST(JSON_VALUE(c.value, '$.codes[1]') AS INT)) AS totalCodeValue2,SUM(CAST(JSON_VALUE(c.value, '$.codes[2]') AS INT)) AS totalCodeValue3, t.type As tableType,ac.arName as activity FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    else if (tables[0].fields[0].dataType == '2')
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,SUM(CAST(JSON_VALUE(c.value, '$.codes[0]') AS INT)) AS totalCodeValue1,SUM(CAST(JSON_VALUE(c.value, '$.codes[1]') AS INT)) AS totalCodeValue2,t.type As tableType,ac.arName as activity FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    else if (tables[0].fields[0].dataType == '3')
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,SUM(CAST(JSON_VALUE(c.value, '$.codes[1]') AS INT)) AS totalCodeValue1,SUM(CAST(JSON_VALUE(c.value, '$.codes[2]') AS INT)) AS totalCodeValue2,t.type As tableType,ac.arName as activity FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    else if (tables[0].fields[0].dataType == '4')
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,SUM(CAST(JSON_VALUE(c.value, '$.codes[0]') AS INT)) AS totalCodeValue1,SUM(CAST(JSON_VALUE(c.value, '$.codes[1]') AS INT)) AS totalCodeValue2,SUM(CAST(JSON_VALUE(c.value, '$.codes[2]') AS INT)) AS totalCodeValue3,SUM(CAST(JSON_VALUE(c.value, '$.codes[3]') AS INT)) AS totalCodeValue4,t.type As tableType,ac.arName as activity FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    else if (tables[0].fields[0].dataType == '5') {
      query = `SELECT f.reviewYear,JSON_VALUE(c.value, '$.TableArName') AS TableArName,f.arName as formName,JSON_VALUE(c.value, '$.arName') AS arName,JSON_VALUE(c.value, '$.questionId') AS questionId,t.period as tablePeriod,ac.arName as activity`;
      for (let i = 0; i < Number(tables[0].fields[0].filter); i++) {
        query += `,SUM(CAST(JSON_VALUE(c.value, '$.codes[${i}]') AS INT)) AS totalCodeValue${i + 1}`
      }
      query += `,t.type As tableType FROM forms f INNER JOIN tables t ON t.formId = f.id INNER JOIN formDatas fd ON f.id = fd.FormId INNER JOIN CompanyForms cf on fd.FormId = cf.formId inner join companies co on cf.companyid = co.id inner join activities ac on co.activityId = ac.id CROSS APPLY OPENJSON(fd.Data) AS c`; // or any other filters
    }
    let whereClause = '';

    // Handle fields from tables[0]
    if (tables[0].fields && tables[0].fields.length > 0) {
      tables[0].fields.forEach((field, fieldIndex) => {
        if (field.name) {
          // Build the condition for arName
          const condition = `t.arName = N'${field.name}'`;

          // Append condition to whereClause
          whereClause += whereClause ? ` or ${condition}` : ` WHERE JSON_VALUE(c.value, '$.TableArName') = N'${field.name}' AND JSON_VALUE(c.value, '$.level') = '1' AND (t.IsDeleted != 1 OR t.IsDeleted IS NULL) AND (f.IsDeleted != 1 OR f.IsDeleted IS NULL) AND ${condition}`;
        }
      });
    }

    // Handle conditions based on tables[1] (Years)
    if (tables.length > 1 && tables[1].enTableName == 'Years') {
      if (tables[1].fields && tables[1].fields.length > 0) {
        tables[1].fields.forEach((field, fieldIndex) => {
          if (field.name) {
            // Add the condition for f.reviewYear
            const reviewYearCondition = `f.reviewYear = N'${field.name}'`;

            // Append this to the whereClause as well
            whereClause += whereClause ? ` and ${reviewYearCondition}` : ` WHERE ${reviewYearCondition}`;
          }
        });
      }
    }
    if (tables[2].fields && tables[2].fields.length > 0) {
      let whereActivity = '';
      tables[2].fields.forEach((field, fieldIndex) => {
        if (field.name) {
          // Add the condition for f.reviewYear
          const activityCondition = `ac.arName = N'${field.name}'`;


          whereActivity += whereActivity ? ` or ${activityCondition}` : ` AND (${activityCondition}`;
          // Append this to the whereClause as well
        }
      });
      whereClause += `${whereActivity})`;
    }
    // Final query with WHERE clause
    let group = ` GROUP BY f.reviewYear,ac.arName,JSON_VALUE(c.value, '$.TableArName'),f.arName,JSON_VALUE(c.value, '$.arName'),JSON_VALUE(c.value, '$.questionId'),t.type,t.period;`
    query += whereClause + group;
    return query;
  }
  onSelectAllFieldsChange(table: ITableDto) {
    // Toggle all fields based on the checkbox state
    table.fields.forEach(field => {
      field.value = table.selectAllFields ? 'selected' : '';
    });
  }
  printExcel() {
    // Prepare workbook and worksheet array
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    // Loop through each report
    this.reports.forEach((report, index) => {
      const reportData = this.formatReportData(report);
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reportData);

      // Apply styles to specific header cells like A1, B1, C1, etc.
      const headers = Object.keys(reportData[0]); // Assuming reportData[0] contains headers

      headers.forEach((header, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Encode address like A1, B1, C1, etc.

        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { t: 's', v: header }; // Ensure the cell exists with a string type
        }

        // Apply styles (e.g., bold and font size 14)
        worksheet[cellAddress].s = {
          font: {
            bold: true,
            sz: 14 // Font size
          },
          alignment: {
            horizontal: "center" // Optional: Center align the header text
          }
        };
      });

      // Add the worksheet to the workbook
      const sheetName = `${report.part}`;
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = worksheet;
    });

    // Generate and download the Excel file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'report_export');
  }
  formatReportData(report: any): any[] {
    const rowData: any[] = [];

    report.fields.forEach((fieldGroup: any[]) => {
      const row: { [key: string]: any } = {};
      fieldGroup.forEach((field: { key: string, value: any }) => {
        row[field.key] = field.value || ""; // Add the field value or an empty string
      });
      rowData.push(row);
    });

    return rowData;
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
  GetActivities() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data.getActivitiesDtos;
          this.filteredActivities = res.Data.getActivitiesDtos;
        }
        else {
          this.tablesRep = [];
          this.filteredActivities = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(0).subscribe(observer);
  }
  GetCountries() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {

          this.countries = res.Data.getCountryDtos;
          this.filteredCountries = res.Data.getCountryDtos;
        }
        else {
          this.tablesRep = [];
          this.filteredCountries = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCountries(0).subscribe(observer);
  }
  GetCompanies() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.companies = res.Data.getCompaniesDtos;
          this.filteredCompanies = res.Data.getCompaniesDtos;
        }
        else {
          this.companies = [];
          this.filteredCompanies = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyService.GetCompanies('', 0).subscribe(observer);
  }
  GetGovernorates() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.governorates = res.Data.getGovernoratesDto;
          this.filteredGovernorates = res.Data.getGovernoratesDto;
        }
        else {
          this.governorates = [];
          this.filteredGovernorates = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetGovernorates(0, '').subscribe(observer);
  }
  GetWilayat() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.wilayat = res.Data.getWilayaDtos;
          this.filteredWilayat = res.Data.getWilayaDtos;
        }
        else {
          this.wilayat = [];
          this.filteredWilayat = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetWilayats(0, 0, '').subscribe(observer);
  }
  GetSectors() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {

        if (res.Data) {
          this.sectors = res.Data.getSectorsDtos;
          this.filteredSectors = res.Data.getSectorsDtos;
        }
        else {
          this.sectors = [];
          this.filteredSectors = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSectors(0).subscribe(observer);
  }
}