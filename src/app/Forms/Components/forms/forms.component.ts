import { Component, OnInit } from '@angular/core';
import { IAddForm } from '../../Dtos/FormDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormService } from '../../Services/form.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  Loader: boolean = false;
  formForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private formServices: FormService) { }
  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      arNotes: [''],
      enNotes: [''],
      IsActive: [''],
      Type: [''],
    })
  }
  saveForm() {
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
}
