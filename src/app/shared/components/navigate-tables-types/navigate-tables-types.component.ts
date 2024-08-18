import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';

@Component({
  selector: 'app-navigate-tables-types',
  templateUrl: './navigate-tables-types.component.html',
  styleUrls: ['./navigate-tables-types.component.css']
})
export class NavigateTablesTypesComponent implements OnInit {
  @Input() coverForm: any;
  @Input() isCoverActive: boolean = false;
  @Input() isWorkDataActive: boolean = false;
  @Input() isCertificationActive: boolean = false;
  @Input() sharedTableType!: number;
  @Output() coverActivated: EventEmitter<void> = new EventEmitter();
  @Output() workDataActivated: EventEmitter<void> = new EventEmitter();
  @Output() certificationActivated: EventEmitter<void> = new EventEmitter();
  @Output() sharedType: EventEmitter<void> = new EventEmitter();
  Loader: boolean = false;
  tableType!: number;
  formId!: string;
  role: string = "";
  temp: string = "";

  companyId!: string;
  tableId: number | null = null;
  @Input() table: any;
  formContents: any[] = [];
  constructor(private authService: LoginService, private activeRouter: ActivatedRoute, private sharedServices: SharedService, private formServices: FormService, private router: Router) { }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    console.log(this.coverForm)
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);
    this.role = result.roles;
    this.tableId = tableIdParam ? +tableIdParam : null;
  }
  TablesNavigation(id: number) {
    this.GetTableById(id);
  }
  GetTableById(id: number): void {
    this.Loader = true;

    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.tableType = res.Data.Type;
        this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
        let navigationPromise;
          switch (this.tableType) {
            case 1:
              navigationPromise = this.router.navigate(['/TransTable', this.formId, id]);
              break;
            case 2:
              navigationPromise = this.router.navigate(['/TableWithoutTrans', this.formId, id]);
              break;
            case 3:
              navigationPromise = this.router.navigate(['/TwoYearsWithParts', this.formId, id]);
              break;
            case 4:
              navigationPromise = this.router.navigate(['/OneYearWithParts', this.formId, id]);
              break;
            case 5:
              navigationPromise = this.router.navigate(['/PeriodTable', this.formId, id]);
              break;
            case 0:
              navigationPromise = this.router.navigate(['/QuarterTable', this.formId, id]);
              break;
            default:
              console.error('Unknown tableType');
              return;
          }
          // navigationPromise.then(() => {
          //   window.location.reload();
          // }).catch((err) => {
          //   console.error('Navigation error:', err);
          // });
        if (res.Data) {
          this.Loader = false;
        }

      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  activateCover() {
    this.coverActivated.emit();
    this.tableId = null;
  }
  activateWorkData() {
    this.workDataActivated.emit();
    this.tableId = null;
  }
  certificationWorkData() {
    this.certificationActivated.emit();
    this.tableId = null;
  }
  displayFormContents() {
    debugger
    if (this.table.Type == 1) {
      let invalidEntries = this.table.formContents.filter((formContent: IGetQuestionDto) => {
        // Check if values array is long enough
        const hasSufficientValues = formContent.values.length >= 3;
  
        // Validate main formContent fields
        const mainInvalid = hasSufficientValues && (
          formContent.values[0] === 0 || formContent.values[1] === 0 || formContent.values[2] === 0 ||
          formContent.values[0] === null || formContent.values[1] === null || formContent.values[2] === null
        );
  
        console.log('mainInvalid:', mainInvalid); // Debugging line
  
        // Validate subCodes fields if present
        const subCodesInvalid = formContent.code.SubCodes && formContent.code.SubCodes.some((subCode: any) => {
          // Check if subCode values array is long enough
          const subCodeHasSufficientValues = subCode.values.length >= 3;
  
          return subCodeHasSufficientValues && (
            subCode.values[0] === 0 || subCode.values[1] === 0 || subCode.values[2] === 0 ||
            subCode.values[0] === null || subCode.values[1] === null || subCode.values[2] === null
          );
        });
  
        console.log('subCodesInvalid:', subCodesInvalid); // Debugging line
  
        return mainInvalid || subCodesInvalid;
      });
  
      if (invalidEntries.length > 0) {
        let errorMessage = 'يجب إدخال قيمة في الصفوف التالية:\n';
        invalidEntries.forEach((entry: IGetQuestionDto) => {
          // Include the main code if it's invalid
          if (entry.code.TypeId != 4) {
            if (entry.values.length >= 3 &&
              (entry.values[0] === 0 || entry.values[1] === 0 || entry.values[2] === 0 ||
                entry.values[0] === null || entry.values[1] === null || entry.values[2] === null))
              errorMessage += `${entry.code.arName}\n`; // Use 'رمز' or any label as needed
          }
          // Include subCodes errors
          if (entry.code.SubCodes) {
            entry.code.SubCodes.forEach((subCode: any) => {
              if (subCode.values.length >= 3 &&
                (subCode.values[0] === 0 || subCode.values[1] === 0 || subCode.values[2] === 0 ||
                  subCode.values[0] === null || subCode.values[1] === null || subCode.values[2] === null)) {
                errorMessage += `${subCode.arName}\n`; // Use 'SubCode' or any label as needed
              }
            });
          }
        });
        alert(errorMessage);
      } else {
        alert('تم ادخال جميع قيم صفوف هذا الجدول');
      }
    } 
    else if (this.table.Type == 2) {
      let invalidEntries = this.table.formContents.filter((formContent: IGetQuestionDto) => {
        // Check if values array is long enough
        const hasSufficientValues = formContent.values.length >= 2;
        // Validate main formContent fields
        const mainInvalid = hasSufficientValues && (
          formContent.values[0] === 0 || formContent.values[1] === 0 ||
          formContent.values[0] === null || formContent.values[1] === null
        );
  
        console.log('mainInvalid:', mainInvalid); // Debugging line
  
        // Validate subCodes fields if present
        const subCodesInvalid = formContent.code.SubCodes && formContent.code.SubCodes.some((subCode: any) => {
          debugger
          // Check if subCode values array is long enough
          const subCodeHasSufficientValues = subCode.values.length >= 2;
  
          return subCodeHasSufficientValues && (
            subCode.values[0] === 0 || subCode.values[1] === 0 ||
            subCode.values[0] === null || subCode.values[1] === null
          );
        });
  
        console.log('subCodesInvalid:', subCodesInvalid); // Debugging line
  
        return mainInvalid || subCodesInvalid;
      });
  
      if (invalidEntries.length > 0) {
        let errorMessage = 'يجب إدخال قيمة في الصفوف التالية:\n';
        invalidEntries.forEach((entry: IGetQuestionDto) => {
          // Include the main code if it's invalid
          if (entry.code.TypeId != 4) {
            if (entry.values.length >= 2 &&
              (entry.values[0] === 0 || entry.values[1] === 0 ||
                entry.values[0] === null || entry.values[1] === null))
              errorMessage += `${entry.code.arName}\n`; // Use 'رمز' or any label as needed
          }
          // Include subCodes errors
          if (entry.code.SubCodes) {
            entry.code.SubCodes.forEach((subCode: any) => {
              if (subCode.values.length >= 2 &&
                (subCode.values[0] === 0 || subCode.values[1] === 0 || subCode.values[2] === 0 ||
                  subCode.values[0] === null || subCode.values[1] === null || subCode.values[2] === null)) {
                errorMessage += `${subCode.arName}\n`; // Use 'SubCode' or any label as needed
              }
            });
          }
        });
        alert(errorMessage);
      } else {
        alert('تم ادخال جميع قيم صفوف هذا الجدول');
      }
    } 
    else if (this.table.Type == 3) {
      let invalidPartsEntries = this.table.formContents.filter((formContent: IGetQuestionDto) => {
        // Validate main values
        const mainValuesInvalid = formContent.values.some((value: number) => value === 0 || value === null);
  
        // Validate subCode values if present
        const subCodesInvalid = formContent.code.SubCodes && formContent.code.SubCodes.some((subCode: any) =>
          subCode.values.some((value: number) => value === 0 || value === null)
        );
  
        return mainValuesInvalid || subCodesInvalid;
      });
  
      if (invalidPartsEntries.length > 0) {
        let errorMessage = 'يجب إدخال قيمة في الصفوف التالية:\n';
        invalidPartsEntries.forEach((entry: IGetQuestionDto) => {
          // Include the main code if it's invalid
          if (entry.code.TypeId != 4) {
            if (entry.values.some(value => value === 0 || value === null)) {
              errorMessage += `${entry.code.arName}\n`; // Use 'رمز' or any label as needed
            }
          }
          // Include subCodes errors
          if (entry.code.SubCodes) {
            entry.code.SubCodes.forEach((subCode: any) => {
              if (subCode.values.some((value:any) => value === 0 || value === null)) {
                errorMessage += `${subCode.arName}\n`;
              }
            });
          }
        });
        alert(errorMessage);
      } else {
        alert('تم ادخال جميع قيم صفوف هذا الجدول');
      }
    }
    else if (this.table.Type == 4){
debugger
let invalidPartsEntries = this.table.formContents.filter((formContent: IGetQuestionDto) => {
  // Validate main values
  const mainValuesInvalid = formContent.values.some((value: number) => value === 0 || value === null);

  // Validate subCode values if present
  const subCodesInvalid = formContent.code.SubCodes && formContent.code.SubCodes.some((subCode: any) =>
    subCode.values.some((value: number) => value === 0 || value === null)
  );

  return mainValuesInvalid || subCodesInvalid;
});

if (invalidPartsEntries.length > 0) {
  let errorMessage = 'يجب إدخال قيمة في الصفوف التالية:\n';
  invalidPartsEntries.forEach((entry: IGetQuestionDto) => {
    // Include the main code if it's invalid
    if (entry.code.TypeId != 4) {
      if (entry.values.some(value => value === 0 || value === null)) {
        errorMessage += `${entry.code.arName}\n`; // Use 'رمز' or any label as needed
      }
    }
    // Include subCodes errors
    if (entry.code.SubCodes) {
      entry.code.SubCodes.forEach((subCode: any) => {
        if (subCode.values.some((value:any) => value === 0 || value === null)) {
          errorMessage += `${subCode.arName}\n`;
        }
      });
    }
  });
  alert(errorMessage);
} else {
  alert('تم ادخال جميع قيم صفوف هذا الجدول');
}
    }
  }
  
}
