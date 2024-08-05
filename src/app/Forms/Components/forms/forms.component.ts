import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { IAddForm, IGetFormDto } from '../../Dtos/FormDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../Services/form.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddTableDto, IGetTableDto } from '../../Dtos/TableDto';
import { Router } from '@angular/router';
import { IAddQuestion, IGetQuestionDto } from '../../Dtos/QuestionDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { SubCodeHomeService } from 'src/app/code/Services/sub-code-home.service';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { IAddTablePartsDto } from '../../Dtos/TablePartsDto';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  Loader: boolean = false;
  tablesCount = 0;
  formCount = 0;
  add: boolean = true;
  addQuestion: boolean = true;
  _addTable: boolean = true;
  quesCount = 0;
  tableId = 0;
  formForm!: FormGroup;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  form!: IGetFormDto;
  tableForm!: FormGroup;
  formId: number = 0;
  formIdScreen: string = '';
  quesIdScreen: string = '';
  addTable!: IAddTableDto;
  idTable: number = 0;
  idFormTables: number = 0;
  id: number = 0;
  addForm!: IAddForm;
  editQues!: IGetQuestionDto;
  quesId: number = 0;
  tableIdInQuestion: number = 0;
  questionForm!: FormGroup;
  codes: ICode[] = [];
  subCodes: ISubCode[] = [];
  code!: ICode;
  Type: number = 0;
  years: number[] = [];
  typeForm: string = '';
  yearDeleted: string = '';
  addTableParts: IAddTablePartsDto[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private formServices: FormService,
    private el: ElementRef,
    private router: Router,
    private renderer: Renderer2,
    private sharedServices: SharedService,
    private codeService: CodeHomeService,
    private subCodeService: SubCodeHomeService,
  ) { }
  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arNotes: ['', Validators.required],
      enNotes: ['', Validators.required],
      isActive: [true, Validators.required],
      type: ['', Validators.required],
      yearDeleted: ['', Validators.required],
      typeQuarter: ['']
    });
    this.tableForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arHeading: ['', Validators.required],
      enHeading: ['', Validators.required],
      IsActive: [true, Validators.required],
      Type: [0, Validators.required],
      formId: [''],
      period: [''],
    });
    this.questionForm = this.formBuilder.group({
      tableId: [''],
      codeId: [0, Validators.required],
    });
    this.GetAllForms();
    this.years = this.sharedServices.generateYears(2000, 2050);

  }
  resetForm() {
    this.add = true;
    this.formForm.reset({
      arName: '',
      enName: '',
      arNotes: '',
      enNotes: '',
      isActive: true,
      type: '',
      yearDeleted: '',
      typeQuarter: ''
    });
  }
  AppenHtmlQues(getQuestionDto: IGetQuestionDto) {
    this.quesCount = getQuestionDto.Id;
    const quesUl = document.getElementById('quesUl' + getQuestionDto.tableId);
    if (quesUl) {
      const newMenuItem = this.createHtmlQues(getQuestionDto);
      this.renderer.appendChild(quesUl, newMenuItem);
    } else {
      const quesUl = this.renderer.createElement('ul');
      quesUl.id = 'quesUl' + getQuestionDto.tableId;
      const newMenuItem = this.createHtmlQues(getQuestionDto);
      const tableLi = this.el.nativeElement.getElementsByClassName(
        'tableLi' + getQuestionDto.tableId
      );
      this.renderer.appendChild(quesUl, newMenuItem);
      this.renderer.appendChild(tableLi[0], quesUl);
    }
  }
  createHtmlQues(getQuestionDto: IGetQuestionDto): HTMLLIElement {
    const quesLi = this.renderer.createElement('li');
    quesLi.id = 'quesLi' + this.quesCount;
    const quesA = this.renderer.createElement('a');
    const divIcon = this.renderer.createElement('div');

    this.renderer.appendChild(quesLi, quesA);

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      editIcon,
      'src',
      '.././../../../assets/images/pencil-outline.png'
    );
    editIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.editQuestion(getQuestionDto.Id); // Pass form ID
    });
    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      delIcon,
      'src',
      '.././../../../assets/images/trash-can-outline.png'
    );
    delIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.showAlertQuestion(getQuestionDto.Id); // Pass form ID
    });
    const text = this.renderer.createText(getQuestionDto.code.arName);
    this.renderer.appendChild(divIcon, delIcon);
    this.renderer.appendChild(divIcon, editIcon);
    this.renderer.appendChild(quesA, text);
    this.renderer.appendChild(quesA, divIcon);

    this.renderer.setStyle(quesA, 'display', 'grid');
    this.renderer.setStyle(quesA, 'font-size', 'large');
    this.renderer.setStyle(quesA, 'place-items', 'center');
    this.renderer.setStyle(delIcon, 'padding', '5px');
    this.renderer.setStyle(quesLi, 'min-width', '160px');
    this.renderer.setStyle(divIcon, 'margin-right', 'auto');

    return quesLi;
  }
  AppenHtmlTable(getTableDto: IGetTableDto) {
    this.tablesCount = getTableDto.id;
    const tableUl = document.getElementById('tableUl' + getTableDto.formId);
    if (tableUl) {
      const newMenuItem = this.createHtmlTable(getTableDto);
      this.renderer.appendChild(tableUl, newMenuItem);
    } else {
      const tableUl = this.renderer.createElement('ul');
      tableUl.id = 'tableUl' + getTableDto.formId;
      const newMenuItem = this.createHtmlTable(getTableDto);
      const formLi = this.el.nativeElement.getElementsByClassName(
        'formLi' + getTableDto.formId
      );
      this.renderer.appendChild(tableUl, newMenuItem);
      this.renderer.appendChild(formLi[0], tableUl);
    }
  }
  AppenHtmlForm(form: IGetFormDto) {
    this.formCount = form.id;
    const newMenuItem = this.createHtmlForm(form);
    const maindiv = document.getElementById('main');
    this.renderer.appendChild(maindiv, newMenuItem);
  }
  createHtmlTable(getTableDto: IGetTableDto): HTMLLIElement {
    const tableLi = this.renderer.createElement('li');
    tableLi.id = this.tablesCount;
    this.renderer.addClass(tableLi, 'tableLi' + getTableDto.id);
    const tableA = this.renderer.createElement('a');
    this.renderer.setStyle(tableLi, 'min-width', '275px');
    const divIcon = this.renderer.createElement('div');
    const crtbLabel = this.renderer.createElement('label');
    const lText = this.renderer.createText('إضافة سؤال');
    this.renderer.appendChild(tableLi, tableA);

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(
      img,
      'src',
      '.././../../../assets/images/table-large.png'
    );
    this.renderer.setAttribute(img, 'alt', '');

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      editIcon,
      'src',
      '.././../../../assets/images/pencil-outline.png'
    );
    editIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.editTable(getTableDto.id, getTableDto.formId); // Pass form ID
    });
    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      delIcon,
      'src',
      '.././../../../assets/images/trash-can-outline.png'
    );
    delIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.showAlertTable(getTableDto.id); // Pass form ID
    });
    const multiTextIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      multiTextIcon,
      'src',
      '.././../../../assets/images/text-box-multiple-outline.png'
    );
    this.renderer.setAttribute(
      multiTextIcon,
      'id',
      `addَQuestionBtn${getTableDto.id.toString()}`
    );
    this.renderer.addClass(multiTextIcon, 'tableLi' + getTableDto.id);
    multiTextIcon.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      e.stopPropagation();

      this.openModal('createQuestion', +getTableDto.id);
    });

    const text = this.renderer.createText(getTableDto.arName);
    this.renderer.appendChild(divIcon, multiTextIcon);
    this.renderer.appendChild(tableA, text);
    this.renderer.appendChild(divIcon, crtbLabel);
    this.renderer.appendChild(tableA, img);
    this.renderer.appendChild(divIcon, delIcon);
    this.renderer.appendChild(divIcon, editIcon);
    this.renderer.appendChild(crtbLabel, lText);
    this.renderer.appendChild(tableA, text);
    this.renderer.appendChild(tableA, divIcon);

    this.renderer.setStyle(tableA, 'display', 'inline-block');
    this.renderer.setStyle(tableA, 'font-size', 'large');
    this.renderer.setStyle(tableA, 'place-items', 'center');
    this.renderer.setStyle(delIcon, 'padding', '5px');
    this.renderer.setStyle(crtbLabel, 'margin-left', '60px');
    this.renderer.setStyle(crtbLabel, 'position', 'static');
    this.renderer.setStyle(crtbLabel, 'transform', 'translateY(0)');
    this.renderer.setStyle(img, 'padding', '8px');
    this.renderer.setStyle(divIcon, 'position', 'relative');
    return tableLi;
  }
  createHtmlForm(form: IGetFormDto): HTMLLIElement {
    const formLi = this.renderer.createElement('li');
    formLi.id = this.formCount;
    this.renderer.addClass(formLi, 'formLi' + this.formCount);
    this.renderer.setStyle(formLi, 'min-width', '275px');
    const subAnchor = this.renderer.createElement('a');
    const crtbLabel = this.renderer.createElement('label');
    const divIcon = this.renderer.createElement('div');
    const text = this.renderer.createText(form.arName);
    const lText = this.renderer.createText('إضافة جدول');

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(
      img,
      'src',
      '.././../../../assets/images/file-document-outline.png'
    );

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      editIcon,
      'src',
      '.././../../../assets/images/pencil-outline.png'
    );
    editIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.editForm(form.id, formLi.id); // Pass form ID
    });

    const detailsIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      detailsIcon,
      'src',
      '.././../../../assets/images/eye-outline.png'
    );
    this.renderer.listen(detailsIcon, 'click', (e: Event) => {
      e.stopPropagation();
      this.router.navigate(['/FormDetails', form.id]);
    });

    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      delIcon,
      'src',
      '.././../../../assets/images/trash-can-outline.png'
    );

    delIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.showAlert(form.id, formLi.id); // Pass form ID
    });

    const tableIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(
      tableIcon,
      'id',
      `addَTableBtn${this.formCount.toString()}`
    );
    this.renderer.setAttribute(
      tableIcon,
      'src',
      '.././../../../assets/images/create-table.png'
    );
    this.renderer.addClass(tableIcon, 'formLi' + this.formCount);
    tableIcon.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      e.stopPropagation();
      this.openModal('createTable', +target.id, form.id);
    });

    this.renderer.appendChild(subAnchor, img);
    this.renderer.appendChild(subAnchor, text);
    this.renderer.appendChild(subAnchor, divIcon);
    this.renderer.appendChild(divIcon, tableIcon);
    this.renderer.appendChild(crtbLabel, lText);
    this.renderer.appendChild(divIcon, crtbLabel);
    this.renderer.appendChild(divIcon, detailsIcon);
    this.renderer.appendChild(divIcon, delIcon);
    this.renderer.appendChild(divIcon, editIcon);
    this.renderer.appendChild(formLi, subAnchor);
    this.renderer.setStyle(subAnchor, 'display', 'inline-block');
    this.renderer.setStyle(subAnchor, 'font-size', 'large');
    this.renderer.setStyle(subAnchor, 'place-items', 'center');
    this.renderer.setStyle(delIcon, 'padding', '5px');
    this.renderer.setStyle(crtbLabel, 'margin-left', '60px');
    this.renderer.setStyle(crtbLabel, 'position', 'static');
    this.renderer.setStyle(crtbLabel, 'transform', 'translateY(0)');
    this.renderer.setStyle(img, 'padding', '8px');
    this.renderer.setStyle(divIcon, 'position', 'relative');
    return formLi;
  }
  openModal(name: string, id: number = 0, formId: number = 0) {
    if (name === 'createTable') this.formId = formId;
    if (name === 'createQuestion') {
      this.tableIdInQuestion = id;
      this.GetAllCodes();
    }
    this.tableId = id;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById(name)
    );
    modal.show();
  }
  GetAllCodes(page: number = 0, textSearch: string = ''): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.resetForm();
        } else {
          this.codes = [];
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.codeService.GetAllCodes(page, textSearch).subscribe(observer);
  }
  saveForm() {
    const allErrors: string[] = [];
    debugger
    if (this.formForm.value.type == '2' && this.formForm.value.typeQuarter == '' && (this.formForm.value.yearDeleted != '0' || this.formForm.value.yearDeleted != '')) {
      allErrors.push('يجب ادخال ربع مسح الاستماره');
      if (this.formForm.valid) {
        Swal.fire({
          icon: 'error',
          title: allErrors.join('<br>'),
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
    }

    if (this.formForm.valid) {
      const Model: IAddForm = {
        arName: this.formForm.value.arName,
        enName: this.formForm.value.enName,
        arNotes: this.formForm.value.arNotes,
        enNotes: this.formForm.value.enNotes,
        IsActive: this.formForm.value.isActive, // Corrected to match the interface
        Type: this.formForm.value.type,
        yearDeleted: this.formForm.value.yearDeleted,
        typeQuarter: this.formForm.value.typeQuarter
      };

      this.Loader = true;
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.Loader = false;
          this.GetAllForms();
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices.addForm(Model).subscribe(observer);
    }
    else {

      for (const controlName in this.formForm.controls) {
        if (this.formForm.controls[controlName].invalid) {
          const errors = this.getControlErrors(controlName);
          allErrors.push(...errors);
        }
      }
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  GetAllForms(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        this.forms = res.Data;
        debugger
        if (res.Data) {

          this.resetForm();

          if (this.forms.length > 0) {
            const element = document.getElementById('items');
            if (element) {
              element.classList.remove('d-none');
            }
          }
          const maindiv = document.getElementById('main');
          if (maindiv) {
            maindiv.innerHTML = ''; // Clear the content
          }

          (res.Data as IGetFormDto[]).forEach((element: IGetFormDto) => {

            this.AppenHtmlForm(element);
            (element.tables as IGetTableDto[]).forEach(
              (elementTable: IGetTableDto) => {

                this.AppenHtmlTable(elementTable);
                (elementTable.formContents as IGetQuestionDto[]).forEach(
                  (elementQuestion: IGetQuestionDto) => {


                    this.AppenHtmlQues(elementQuestion);
                  }
                );
              }
            );
          });
        } else {
          const element = document.getElementById('items');
          if (element) {
            element.classList.add('d-none');
          }
          const maindiv = document.getElementById('main');
          if (maindiv) {
            maindiv.innerHTML = ''; // Clear the content
          }
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetAllForms().subscribe(observer);
  }
  showAlert(id: number, formId: string): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا',
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteForm(id, formId);
      }
    });
  }
  DeleteForm(id: number, formId: string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllForms();
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.DeleteForm(id).subscribe(observer);
  }
  editForm(id: number, formId: string): void {
    this.formIdScreen = formId;
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.addForm = res.Data;
          this.formForm.patchValue({
            arName: this.addForm.arName,
            enName: this.addForm.enName,
            arNotes: this.addForm.arNotes,
            enNotes: this.addForm.enNotes,
            isActive: this.addForm.IsActive,
            type: this.addForm.Type,
            yearDeleted: this.addForm.yearDeleted,
            typeQuarter: this.addForm.typeQuarter
          });
          debugger
          this.Loader = false;
          this.add = false;
          const button = document.getElementById('addFormBtn');
          if (button) {
            button.click();
          }
          this.id = id;

          this.openModal('createForm');
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
  updateForm() {
    this.Loader = true;
    if (this.formForm.valid) {
      const Model: IAddForm = {
        arName: this.formForm.value.arName,
        enName: this.formForm.value.enName,
        arNotes: this.formForm.value.arNotes,
        enNotes: this.formForm.value.enNotes,
        IsActive: this.formForm.value.isActive,
        Type: this.formForm.value.type,
        yearDeleted: this.formForm.value.yearDeleted,
        typeQuarter: this.formForm.value.typeQuarter
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.form = res.Data;
          this.GetAllForms();
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices.UpdateForm(this.id, Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  saveTable() {

    this.Loader = true;
    this.tableForm.value.fromId = this.formId;
    if (this.tableForm.valid) {
      const Model: IAddTableDto = {
        arName: this.tableForm.value.arName,
        enName: this.tableForm.value.enName,
        arHeading: this.tableForm.value.arHeading,
        enHeading: this.tableForm.value.enHeading,
        Type: this.tableForm.value.Type,
        formId: this.tableForm.value.fromId,
        IsActive: this.tableForm.value.IsActive,
        period: Number(this.tableForm.value.period),
        tableParts: this.addTableParts
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('tableCancel');
          if (button) {
            button.click();
          }
          this.resetTable();
          this.GetAllForms();
          console.log(res);
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices.AddTable(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  addRow() {
    this.addTableParts.push({
      arName: '',
      enName: '',
      tableId: 1
    });
  }
  removeItem(index: number): void {
    this.addTableParts.splice(index, 1);
  }
  updateTableParts(index: number, field: keyof IAddTablePartsDto, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Ensure that value is correctly assigned based on field type
    if (field === 'arName' || field === 'enName') {
      this.addTableParts[index][field] = value;
    }
  }
  areAllFieldsFilled(): boolean {
    return this.addTableParts.every(item => item.arName && item.enName);
  }
  onTypeChange() {
    // عند تغيير نوع الجدول، إعادة تعيين addTableParts إلى مصفوفة فارغة
    this.addTableParts = [];
  }
  resetTable(): void {
    this.tableForm.reset({
      arName: '',
      enName: '',
      arHeading: '',
      enHeading: '',
      Type: 0,
      fromId: '',
      isActive: true,
    });
    this.addTableParts = [];
  }
  showAlertTable(id: number): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا',
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteTable(id);
      }
    });
  }
  DeleteTable(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllForms();
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.DeleteTable(id).subscribe(observer);
  }
  editTable(id: number, idFormTables: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.addTable = res.Data;
          if (this.addTable.period == 0) {
            this.tableForm.value.period = '';
          } else this.tableForm.value.period = this.addTable.period;
          this.tableForm.patchValue({
            arName: this.addTable.arName,
            enName: this.addTable.enName,
            arHeading: this.addTable.arHeading,
            enHeading: this.addTable.enHeading,
            Type: this.addTable.Type,
            fromId: this.addTable.formId,
            isActive: this.addTable.IsActive,
            period: this.tableForm.value.period,
          });
          this.addTableParts = res.Data.tableParts;
          this.Loader = false;
          this._addTable = false;
          const button = document.getElementById(
            `addَTableBtn${this.addTable.formId}`
          );
          if (button) {
            button.click();
          }
          this.idTable = id;
          this.idFormTables = idFormTables;
        } else {
          this.Loader = false;
          Swal.fire({
            icon: 'error',
            title: res.Message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  updateTable() {
    debugger
    this.Loader = true;
    if (!(this.tableForm.value.Type == '5')) this.tableForm.value.period = 0
    if (this.tableForm.valid) {
      const Model: IAddTableDto = {
        arName: this.tableForm.value.arName,
        enName: this.tableForm.value.enName,
        arHeading: this.tableForm.value.arHeading,
        enHeading: this.tableForm.value.enHeading,
        Type: this.tableForm.value.Type,
        formId: this.idFormTables,
        IsActive: this.tableForm.value.IsActive,
        period: this.tableForm.value.period,
        tableParts: this.addTableParts
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('tableCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllForms();
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices.UpdateTable(this.idTable, Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  saveQues() {
    this.Loader = true;
    this.questionForm.value.tableId = this.tableIdInQuestion;
    if (!(this.questionForm.value.codeId > 0)) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    } else if (this.questionForm.valid) {
      const Model: IAddQuestion = {
        codeId: Number(this.questionForm.value.codeId),
        tableId: this.questionForm.value.tableId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('quesCancel');

          if (button) {
            button.click();
          }
          this.resetQuestion();
          this.GetAllForms();
          console.log(res);
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices.AddFormContent(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  resetQuestion(): void {
    this.addQuestion = true;
    this.tableForm.reset({
      codeId: 0,
      tableId: '',
    });
  }
  showAlertQuestion(id: number): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا',
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteQuestion(id);
      }
    });
  }
  DeleteQuestion(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllForms();
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.DeleteFormContent(id).subscribe(observer);
  }
  editQuestion(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.editQues = res.Data;
          this.questionForm.patchValue({
            tableId: this.editQues.tableId,
            codeId: this.editQues.codeId,
          });
          this.GetSubCodesById(this.editQues.codeId)
          this.Loader = false;
          this.addQuestion = false;
          const button = document.getElementById(
            `addَQuestionBtn${this.editQues.tableId}`
          );
          if (button) {
            button.click();
          }
          this.quesId = id;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormContentById(id).subscribe(observer);
  }
  updateQuestion() {
    this.Loader = true;
    if (this.questionForm.valid) {
      const Model: IAddQuestion = {
        tableId: this.questionForm.value.tableId,
        codeId: this.questionForm.value.codeId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('quesCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.form = res.Data;
          this.GetAllForms();
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.Loader = false;
        },
      };
      this.formServices
        .UpdateFormContent(this.quesId, Model)
        .subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000,
      });
      this.Loader = false;
    }
  }
  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.GetSubCodesById(Number(selectedValue))
  }
  GetSubCodesById(id: number) {
    this.Loader = true;
    const observer = {
      next: (res: any) => {

        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.subCodes = res.Data;
        }
        else {
          this.subCodes = [];
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.subCodeService.GetSubCodesById(Number(id)).subscribe(observer);
  }
  getControlErrors(controlName: string): string[] {
    const control = this.formForm.get(controlName);
    const errors: string[] = [];

    if (control && control.errors) {

      // Check if control is not null and has errors
      if (controlName == 'arName') controlName = 'اسم الاستمارة بالعربى';
      if (controlName == 'enName') controlName = 'Form Name in English';
      if (controlName == 'arNotes') controlName = 'ملاحظات بالعربى';
      if (controlName == 'enNotes') controlName = 'Notes in English';
      if (controlName == 'isActive') controlName = 'حالة الاستماره';
      if (controlName == 'type') controlName = 'نوع الاستماره';
      if (controlName == 'yearDeleted') controlName = 'تاريخ المسح الاستماره';

      if (control.errors['required'] && (controlName == 'حالة الاستماره' || controlName == 'نوع الاستماره' || controlName == 'تاريخ المسح الاستماره')) {
        errors.push(`يجب اختيار ${controlName}`);
      }
      else if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
      // Add other error types here if needed
    }

    return errors;
  }
}