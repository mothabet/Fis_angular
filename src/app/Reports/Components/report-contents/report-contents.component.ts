import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ResearcherHomeService } from 'src/app/researcher/services/researcher-home.service';
import { IAddReportPartDto, IFieldDto, IReportFilterDto, ITableDto, ITableFieldDto } from '../../Dtos/ReportDto';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  sectorFields: IFieldDto[] = [];
  activitiesFields: IFieldDto[] = [];
  subActivitiesFields: IFieldDto[] = [];
  governoratesFields: IFieldDto[] = [];
  wilayatFields: IFieldDto[] = [];
  report: IAddReportPartDto = {
    part: '',
    query: '',
    withChart: false,  // default to false
    chartType: 0,      // default chart type
    reportId: 0        // default ID
};
  tables: ITableDto[] = [];
  reportId!:string
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
  constructor(private renderer: Renderer2, private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private reportServices: ReportService,
    private companyHomeServices: CompanyHomeService, private formServices: FormService,
    private researcherService: ResearcherHomeService,private activeRouter: ActivatedRoute) { }
  ngOnInit(): void {
    this.reportId = this.activeRouter.snapshot.paramMap.get('reportId')!;
  }
  GetTableFields(tableType: number): void {
    if (this.tableType != 0) {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            if (tableType == 1)
              this.companyFields = res.Data
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
  onTableSelect(): void {
    if (this.tableType === 1) {
      // Add the 'Companies' table to tableDto
      const tableDto: ITableDto = {
        enTableName: 'Companies',
        arTableName: 'الشركات',
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      // Fetch table fields for the selected type (1 for Companies)
      this.GetTableFields(1);
    }
  }
  onFieldSelect(event: Event, table: ITableDto): void {
    debugger
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (table.enTableName == 'Companies') {
      const selectedField = this.companyFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'Researcher') {
      const selectedField = this.researcherFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'Sectors') {
      const selectedField = this.sectorFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'Activities') {
      const selectedField = this.activitiesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'SubActivities') {
      const selectedField = this.subActivitiesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'Governorates') {
      const selectedField = this.governoratesFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
        const tableField: ITableFieldDto = {
          name: selectedField.name,
          dataType: selectedField.dataType,
          filter: null, // Initialize as null or a valid default value
          value: '' // Initialize value as needed
        };

        table.fields.push(tableField);
      }
    }
    else if (table.enTableName == 'Wilayats') {
      const selectedField = this.wilayatFields.find(field => field.name === selectedValue);

      if (selectedField && table) {
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
  openModal() {
    const modal = document.getElementById('chooseTable');
    if (modal) {
      modal.classList.add('show');  // Add 'show' class to make it visible
      modal.style.display = 'block'; // Set display to 'block' to show the modal
      modal.setAttribute('aria-hidden', 'false'); // Set aria-hidden to false
      document.body.classList.add('modal-open'); // Add class to prevent background scrolling
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show'; // Create the backdrop
      document.body.appendChild(backdrop); // Append the backdrop to the body
    }
  }
  closeModal() {
    const modal = document.getElementById('chooseTable');
    if (modal) {
      modal.classList.remove('show'); // Remove 'show' class to hide it
      modal.style.display = 'none'; // Set display to 'none' to hide it
      modal.setAttribute('aria-hidden', 'true'); // Set aria-hidden to true
      document.body.classList.remove('modal-open'); // Remove class from body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop from the DOM
      }
    }
  }
  saveReport() {
    this.report.query = this.fbuildJoinQuery(this.tables, this.stringFilterItems, this.numberFilterItems);
    this.report.reportId = +this.reportId;
    const observer = {
      next: (res: any) => {
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
    this.reportServices.AddReportContent(this.report).subscribe(observer);
  }
  appendTable(): void {
    if (this.selectedTable) {
      const tableDto: ITableDto = {
        enTableName: this.selectedTable.enName,
        arTableName: this.selectedTable.arName,
        fields: []  // Initial empty fields array
      };
      this.tables.push(tableDto);
      debugger
      if (this.selectedTable.enName == 'Researcher')
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
      this.closeModal();
    }
  }
  fbuildJoinQuery(tables: ITableDto[], stringFilterItems: IReportFilterDto[], numberFilterItems: IReportFilterDto[]): string {
    let query = 'SELECT ';
    let joins = '';
    let fromTable = '';
    let fields = '';
    let whereClause = '';
  
    tables.forEach((table, tableIndex) => {
      const tableAlias = `t${tableIndex + 1}`;
  
      // If no specific fields are defined for the table, select all fields (*)
      if (table.fields.length === 0) {
        fields += `${tableAlias}.*`;
      } else {
        // Select the fields for each table if fields are defined
        table.fields.forEach((field, fieldIndex) => {
          fields += `${tableAlias}.${field.name} AS ${table.enTableName}_${field.name}`;
  
          // Add a comma if not the last field of the last table
          if (fieldIndex !== table.fields.length - 1 || tableIndex !== tables.length - 1) {
            fields += ', ';
          }
          debugger
          // Build WHERE condition if value and filter are present
          if (field.value !== null && field.filter !== null) {
            let filterItem;
  
            // Use appropriate filter for string or number data type
            if (field.dataType === 'String') {
              filterItem = stringFilterItems.find(f => f.id === field.filter);
            } else {
              filterItem = numberFilterItems.find(f => f.id === field.filter);
            }
  
            if (filterItem) {
              const condition = `${tableAlias}.${field.name} ${filterItem.enName} ${field.value}`;
              whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
            }
          }
        });
      }
  
      // Ensure a comma between * and other fields, but only if it's not the last table
      if (tableIndex !== tables.length - 1 && table.fields.length === 0) {
        fields += ', ';
      }
  
      // Construct the FROM and JOIN part of the query
      if (tableIndex === 0) {
        fromTable = `FROM ${table.enTableName} ${tableAlias}`;
      } else {
        switch (table.enTableName) {
          case 'Researchers':
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
          default:
            throw new Error(`Unknown table: ${table.enTableName}`);
        }
      }
    });
  
    // Final query with SELECT, FROM, JOIN, and WHERE
    query = `SELECT ${fields} ${fromTable} ${joins} ${whereClause};`;
  
    return query;
  }
}
