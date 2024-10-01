import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ResearcherHomeService } from 'src/app/researcher/services/researcher-home.service';
import { IAddReportPartDto, IFieldDto, IGetReportDto, IGetReportPartsDto, IReportFilterDto, ITableDto, ITableFieldDto } from '../../Dtos/ReportDto';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';

@Component({
  selector: 'app-report-contents',
  templateUrl: './report-contents.component.html',
  styleUrls: ['./report-contents.component.css']
})
export class ReportContentsComponent implements OnInit {
  @ViewChild('chooseTable') chooseTableModal!: ElementRef;
  tableType: number = 0;
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
    { dataType: 'String', name: 'اسم المنشأة' },
    { dataType: 'String', name: 'رقم السجل التجارى' },
    { dataType: 'String', name: 'رقم الترخيص البلدي' },
    { dataType: 'String', name: 'النشاط الاقتصادى الرئيسى' },
    { dataType: 'String', name: 'النشاط الثانوى' },
    { dataType: 'String', name: 'عنوان المنشاة' },
    { dataType: 'String', name: 'المنطقة' },
    { dataType: 'String', name: 'الولاية' },
    { dataType: 'String', name: 'رقم صندوق البريد' },
    { dataType: 'String', name: 'الرمز البريدى' },
    { dataType: 'String', name: 'رقم الهاتف' },
    { dataType: 'String', name: 'رقم الفاكس' },
    { dataType: 'String', name: 'البريد الالكترونى' },
    { dataType: 'String', name: 'الموقع الإلكتروني' },
    { dataType: 'bool', name: 'منشاة فردية' },
    { dataType: 'bool', name: 'تضامنية' },
    { dataType: 'bool', name: 'توصية' },
    { dataType: 'bool', name: 'محاصة' },
    { dataType: 'bool', name: 'مساهمة ( عامه او مقفله )' },
    { dataType: 'bool', name: 'محدودة المسؤولية' },
    { dataType: 'bool', name: 'فرع شركة اجنبية' },
    { dataType: 'bool', name: 'أخرى (حدد)' },
    { dataType: 'DateTime', name: 'الفترة او السنه الماليه من' },
    { dataType: 'DateTime', name: 'الفترة او السنه الماليه إالى' },
  ];
  certificationFields: IFieldDto[] = [
    { dataType: 'String', name: 'اسم معبئ الاستمارة' },
    { dataType: 'String', name: 'رقم الهاتف' },
    { dataType: 'DateTime', name: 'تاريخ التعبئة' },
  ]
  coverFields: IFieldDto[] = [
    { dataType: 'Int', name: 'رمز النشاط' },
    { dataType: 'Int', name: 'رقم الاستماره' },
    { dataType: 'Int', name: 'المرجع. سنة' }
  ]
  quarterCoverFields: IFieldDto[] = [
    { dataType: 'String', name: 'اسم مؤسستك' },
    { dataType: 'String', name: 'الرمز البريدي' },
    { dataType: 'String', name: 'رقم الاستماره' },
    { dataType: 'String', name: 'رقم الهاتف' },
    { dataType: 'String', name: 'رقم الفاكس' },
    { dataType: 'String', name: 'عنوان البريد الإلكتروني' },
    { dataType: 'String', name: 'التوزيع الجغرافي للاستثمار الأجنبي المباشر المتجه إلى الخارج (حسب الدولة)' },
  ]
  isDropdownOpen = false;
  searchTerm: string = '';
  filteredCodes: ICode[] = [];
  report: IAddReportPartDto = {
    part: '',
    query: '',
    withChart: false,  // default to false
    chartType: 0,      // default chart type
    reportId: 0        // default ID
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
    { id: 1, arName: 'البيانات العامة', enName: 'GeneralData' },
    { id: 1, arName: 'الشهادة', enName: 'Certification' },
  ];
  codes: ICode[] = [];
  reports!: any[];
  formContents!: any[];
  currentFields: IFieldDto[] = this.coverFields;
  constructor(private renderer: Renderer2, private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private reportServices: ReportService,
    private companyHomeServices: CompanyHomeService, private formServices: FormService,
    private researcherService: ResearcherHomeService, private codeHomeService: CodeHomeService,
    private activeRouter: ActivatedRoute) { }
  ngOnInit(): void {
    this.reportId = this.activeRouter.snapshot.paramMap.get('reportId')!;
    this.GetAllCodes();
    this.GetReports();
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
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  filterSubCodes() {
    this.filteredCodes = this.codes.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }
  selectCode(code: any) {
    this.searchTerm = code.arName;
    this.isDropdownOpen = false;

    if (this.formContents) { // Check if formContents is initialized
      const isAlreadySelected = this.formContents.some(
        (item: any) => item === code.arName
      );

      if (!isAlreadySelected) {
        this.formContents.push(code.arName); // Push the arName, as requested
      }
    } else {
      this.formContents = [code.arName]; // Initialize with the first value if undefined
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
            this.showLoader = false;
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
  onTableSelect(): void {
    this.tables = [];

    if (this.tableType === 1) {
      // Add the 'Companies' table to tableDto
      const tableDto: ITableDto = {
        selectAllFields: false,
        enTableName: 'Companies',
        arTableName: 'الشركات',
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(1);
    }
    else if (this.tableType === 3) {
      const tableDto: ITableDto = {
        selectAllFields: false,
        enTableName: 'Researcher',
        arTableName: 'الباحثين',
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(3);
    }
    else if (this.tableType === 2) {
      const tableDto: ITableDto = {
        selectAllFields: false,
        enTableName: 'Forms',
        arTableName: 'الاستمارات',
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(2);
    }
    else if (this.tableType === 4) {
      const tableDto: ITableDto = {
        selectAllFields: false,
        enTableName: 'FormContent',
        arTableName: 'محتوى الاستمارة',
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(2);
    }
  }
  onFieldSelect(event: Event, table: ITableDto): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (table.enTableName == 'Companies') {
      const selectedField = this.companyFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Researcher') {
      const selectedField = this.researcherFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Sectors') {
      const selectedField = this.sectorFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Activities') {
      const selectedField = this.activitiesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'SubActivities') {
      const selectedField = this.subActivitiesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Governorates') {
      const selectedField = this.governoratesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Wilayats') {
      const selectedField = this.wilayatFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Tables') {
      const selectedField = this.tableFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Forms') {
      const selectedField = this.formFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'GeneralData') {
      const selectedField = this.generalDataFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Cover') {
      const selectedField = this.coverFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
    else if (table.enTableName == 'Certification') {
      const selectedField = this.certificationFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        // Check if the field already exists in the table's fields array
        const fieldExists = table.fields.some(field => field.name === selectedField.name);

        if (!fieldExists) {
          const tableField: ITableFieldDto = {
            name: selectedField.name,
            dataType: selectedField.dataType,
            filter: null, // Initialize as null or a valid default value
            value: '' // Initialize value as needed
          };

          table.fields.push(tableField);
        }
      }
    }
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
    this.report.query = this.fbuildJoinQuery(this.tables, this.stringFilterItems, this.numberFilterItems);
    this.report.reportId = +this.reportId;
    
    if (this.report.part == '' || this.report.part == null || this.report.part == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال عنوان الجدول',
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      return;
    }
    if (this.report.query == '' || this.report.query == 'SELECT    ;' || this.report.query == null || this.report.query == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'يجب تحديد جداول للتقرير',
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      return;
    }

    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        this.tables = [];
        this.report = {
          part: '',
          query: '',
          withChart: false,  // default to false
          chartType: 0,      // default chart type
          reportId: 0        // default ID
        };
        this.GetReports();
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
  appendTable(): void {
    if (this.selectedTable) {

      const tableDto: ITableDto = {
        selectAllFields: false,
        enTableName: this.selectedTable.enName,
        arTableName: this.selectedTable.arName,
        fields: []  // Initial empty fields array
      };
      const tableExists = this.tables.some(table => table.enTableName === this.selectedTable!.enName);

      // Append the table only if it doesn't already exist
      if (!tableExists) {
        this.tables.push(tableDto);
      } else {
        this.closeModal();
        return;
      }
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
      this.closeModal();
    }
  }
  fbuildJoinQuery(tables: ITableDto[], stringFilterItems: IReportFilterDto[], numberFilterItems: IReportFilterDto[]): string {
    if (tables[0].enTableName != 'FormContent') {
      let query = 'SELECT ';
      let joins = '';
      let fromTable = '';
      let fields = '';
      let whereClause = '';
      
      tables.forEach((table, tableIndex) => {
        const tableAlias = `t${tableIndex + 1}`;

        // Determine if all fields should be selected
        if (table.selectAllFields || table.fields.length === 0) {
          fields += `${tableAlias}.*`;
        } else {
          // Select the fields for each table if fields are defined
          table.fields.forEach((field, fieldIndex) => {
            fields += `${tableAlias}.${field.name} AS ${table.enTableName}_${field.name}`;

            // Add a comma if not the last field of the last table
            if (fieldIndex !== table.fields.length - 1 || tableIndex !== tables.length - 1) {
              fields += ', ';
            }
            // Only build WHERE condition if both value and filter are present

          });
        }
        table.fields.forEach((field, fieldIndex) => {
          if (field.value !== null && field.filter !== null) {
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
        if (tableIndex !== tables.length - 1 && (table.selectAllFields || table.fields.length === 0)) {
          fields += ', ';
        }

        // Construct the FROM and JOIN part of the query
        if (tableIndex === 0) {
          fromTable = `FROM ${table.enTableName} ${tableAlias}`;
        } else {
          switch (table.enTableName) {
            case 'Companies':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.id = ${tableAlias}.researcherId`;
              break;
            case 'Researcher':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.researcherId = ${tableAlias}.id `;
              break;
            case 'Sectors':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.sectorId = ${tableAlias}.id `;
              break;
            case 'Activities':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.activityId = ${tableAlias}.id `;
              break;
            case 'SubActivities':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.subActivityId = ${tableAlias}.id `;
              break;
            case 'Governorates':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.governoratesId = ${tableAlias}.id `;
              break;
            case 'Wilayats':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.wilayatId = ${tableAlias}.id `;
              break;
            case 'Tables':
              joins += ` JOIN ${table.enTableName} ${tableAlias} ON t1.id = ${tableAlias}.formId `;
              break;
            default:
              throw new Error(`Unknown table: ${table.enTableName}`);
          }
        }
      });

      // Final query with SELECT, FROM, JOIN, and WHERE
      query = `SELECT ${fields} ${fromTable} ${joins} ${whereClause};`;

      return query;
    }
    else{
      return '';
    }
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
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}