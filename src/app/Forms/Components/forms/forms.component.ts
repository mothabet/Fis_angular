import { Component, ElementRef, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { IAddForm, IGetFormDto } from '../../Dtos/FormDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormService } from '../../Services/form.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  Loader: boolean = false;
  tablesCount = 0;
  formCount = 0;
  quesCount = 0;
  tableId = 0;
  formForm!: FormGroup;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  constructor(private rendererFactory: RendererFactory2, private formBuilder: FormBuilder, private toastr: ToastrService,
    private formServices: FormService,
    private el: ElementRef,
    private renderer: Renderer2, private sharedServices: SharedService) { }
  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arNotes: [''],
      enNotes: [''],
      isActive: [''],
      type: [''],
    });
    const element = document.getElementById('items');
    if (element) {
      element.classList.remove('d-none');
    }

    this.GetAllForms();
  }
  saveForm(event: Event) {
    if (this.formForm.valid) {
      const Model: IAddForm = {
        arName: this.formForm.value.arName,
        enName: this.formForm.value.enName,
        arNotes: this.formForm.value.arNotes,
        enNotes: this.formForm.value.enNotes,
        IsActive: this.formForm.value.IsActive, // Corrected to match the interface
        Type: this.formForm.value.Type
      };
      

      this.Loader = true;
      const observer = {
        next: (res: any) => {
          const form: IGetFormDto = {
            id:res.Data,
            arName: this.formForm.value.arName,
            enName: this.formForm.value.enName,
            arNotes: this.formForm.value.arNotes,
            enNotes: this.formForm.value.enNotes,
            IsActive: this.formForm.value.IsActive, // Corrected to match the interface
            Type: this.formForm.value.Type
          };
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.Loader = false;
          this.resetForm();
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
          const element = document.getElementById('items');
          if (element) {
            element.classList.remove('d-none');
          }
          this.AppenHtmlForm(form);
        },
        error: (err: any) => {
          this.Loader = false;
          if (err.status) {
            switch (err.status) {
              case 400:
                this.toastr.error(err.error.Errors[0]);
                break;
              case 401:
                this.toastr.error('Unauthorized', err.message);
                break;
              case 403:
                this.toastr.error('Forbidden', err.message);
                break;
              case 404:
                this.toastr.error('Not Found', err.message);
                break;
              case 500:
                this.toastr.error('Internal Server Error', err.message);
                break;
              default:
                this.toastr.error('An unexpected error occurred', err.message);
            }
          } else {
            this.toastr.error('An unknown error occurred', err.message);
          }
        },
      };
      this.formServices.addForm(Model).subscribe(observer);
    }
  }
  resetForm() {
    this.formForm.reset({
      arName: '',
      enName: '',
      arNotes: '',
      enNotes: '',
      IsActive: '',
      Type: '',
    })
  }

  AppenHtmlQues(itemId: number) {
    debugger
    this.quesCount++;
    const quesUl = document.getElementById('quesUl' + itemId);
    if (quesUl) {
      const newMenuItem = this.createHtmlQues();
      newMenuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the event from bubbling up to parent elements
        this.AppenHtmlQues(itemId); // Your function to handle the click event
      });
      this.renderer.appendChild(quesUl, newMenuItem);
    }
    else {
      const quesUl = this.renderer.createElement('ul');
      quesUl.id = 'quesUl' + itemId;
      const newMenuItem = this.createHtmlQues();
      newMenuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the event from bubbling up to parent elements
      });
      const tableLi = this.el.nativeElement.getElementsByClassName('tableLi' + itemId);
      this.renderer.appendChild(quesUl, newMenuItem);
      this.renderer.appendChild(tableLi[0], quesUl);
    }
  }
  createHtmlQues(): HTMLLIElement {
    const quesLi = this.renderer.createElement('li');
    quesLi.id = 'quesLi' + this.quesCount
    const quesA = this.renderer.createElement('a');
    const divIcon = this.renderer.createElement('div');

    this.renderer.appendChild(quesLi, quesA);

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(editIcon, 'src', '.././../../../assets/images/pencil-outline.png');

    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(delIcon, 'src', '.././../../../assets/images/trash-can-outline.png');
    debugger
    const text = this.renderer.createText('سؤال 1');
    this.renderer.appendChild(divIcon, delIcon);
    this.renderer.appendChild(divIcon, editIcon);
    this.renderer.appendChild(quesA, text);
    this.renderer.appendChild(quesA, divIcon);

    this.renderer.setStyle(quesA, 'display', 'grid');
    this.renderer.setStyle(quesA, 'font-size', 'large');
    this.renderer.setStyle(quesA, 'place-items', 'center');
    this.renderer.setStyle(delIcon, 'padding', '5px');
    this.renderer.setStyle(quesLi, 'min-width', '160px');

    return quesLi;
  }

  AppenHtmlTable(itemId: number) {
    this.tablesCount++;
    const tableUl = document.getElementById('tableUl' + itemId);
    if (tableUl) {
      const newMenuItem = this.createHtmlTable();
      newMenuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the event from bubbling up to parent elements
        this.AppenHtmlQues(itemId); // Your function to handle the click event
      });
      this.renderer.appendChild(tableUl, newMenuItem);
    }
    else {
      const tableUl = this.renderer.createElement('ul');
      tableUl.id = 'tableUl' + itemId;
      const newMenuItem = this.createHtmlTable();
      newMenuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the event from bubbling up to parent elements
        this.AppenHtmlQues(itemId)
      });
      const formLi = this.el.nativeElement.getElementsByClassName('formLi' + itemId);
      this.renderer.appendChild(tableUl, newMenuItem);
      this.renderer.appendChild(formLi[0], tableUl);
    }
  }
  createHtmlTable(): HTMLLIElement {
    debugger
    const tableLi = this.renderer.createElement('li');
    tableLi.id = this.tablesCount
    this.renderer.addClass(tableLi, 'tableLi' + this.tablesCount);
    const tableA = this.renderer.createElement('a');
    this.renderer.setStyle(tableLi, 'min-width', '275px');
    const divIcon = this.renderer.createElement('div');
    const crtbLabel = this.renderer.createElement('label');
    const lText = this.renderer.createText('إضافة سؤال');
    this.renderer.appendChild(tableLi, tableA);

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', '.././../../../assets/images/table-large.png');
    this.renderer.setAttribute(img, 'alt', '');

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(editIcon, 'src', '.././../../../assets/images/pencil-outline.png');

    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(delIcon, 'src', '.././../../../assets/images/trash-can-outline.png');

    const multiTextIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(multiTextIcon, 'src', '.././../../../assets/images/text-box-multiple-outline.png');
    this.renderer.setAttribute(multiTextIcon, 'id', this.tablesCount.toString());
    this.renderer.addClass(multiTextIcon, 'tableLi' + this.tablesCount);
    multiTextIcon.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      e.stopPropagation();
      this.openModal('createQuestion', +target.id);
    });

    const text = this.renderer.createText('جدول 1');
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
    formLi.id = this.formCount
    this.renderer.addClass(formLi, 'formLi' + this.formCount);
    this.renderer.setStyle(formLi, 'min-width', '275px');
    const subAnchor = this.renderer.createElement('a');
    const crtbLabel = this.renderer.createElement('label');
    const divIcon = this.renderer.createElement('div');
    const text = this.renderer.createText(form.arName);
    const lText = this.renderer.createText('إضافة جدول');

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', '.././../../../assets/images/file-document-outline.png');

    const editIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(editIcon, 'src', '.././../../../assets/images/pencil-outline.png');

    const detailsIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(detailsIcon, 'src', '.././../../../assets/images/eye-outline.png');

    const delIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(delIcon, 'src', '.././../../../assets/images/trash-can-outline.png');

    delIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      this.showAlert(form.id, formLi.id); // Pass form ID
  });


    const tableIcon = this.renderer.createElement('img');
    this.renderer.setAttribute(tableIcon, 'id', this.formCount.toString());
    this.renderer.setAttribute(tableIcon, 'src', '.././../../../assets/images/create-table.png');
    this.renderer.addClass(tableIcon, 'formLi' + this.formCount);
    tableIcon.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      e.stopPropagation();
      this.openModal('createTable', +target.id);
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
  AppenHtmlForm(form: IGetFormDto) {
    this.formCount++;
    const newMenuItem = this.createHtmlForm(form);
    const maindiv = document.getElementById('main');
    this.renderer.appendChild(maindiv, newMenuItem);
  }

  openModal(name: string, id: number) {
    this.tableId = id;
    const modal = new (window as any).bootstrap.Modal(document.getElementById(name));
    modal.show();
  }

  saveTable() {
    this.AppenHtmlTable(this.tableId);
    const button = document.getElementById('tableCancel');
    if (button) {
      setTimeout(() => {
        button.click();
      }, 0);
    }
  }

  saveQues() {
    this.AppenHtmlQues(this.tableId);
    const button = document.getElementById('quesCancel');
    if (button) {
      setTimeout(() => {
        button.click();
      }, 0);
    }
  }

  GetAllForms(type : string =''): void {
    debugger
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.forms = res.Data;
          this.resetForm();
          if(type != 'delete')
          {
            (res.Data as IGetFormDto[]).forEach((element: IGetFormDto) => {
              this.AppenHtmlForm(element);
            });
          }
        }
        else {

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

  removeForm(formId: string, containerId: string) {
    debugger
    const container = document.getElementById(containerId);
    const formLi = document.getElementById(formId);
    if (container && formLi) {
        this.renderer.removeChild(container, formLi);
    }
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
      cancelButtonText: 'لا'
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
        this.removeForm(formId, 'main');
        this.GetAllForms('delete');
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.DeleteForm(id).subscribe(observer);
  }
}