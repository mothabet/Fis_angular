import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/auth/services/login.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TopScreenService } from 'src/app/shared/services/top-screen.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { ProfileService } from '../../Services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  showLoader: boolean = false;
  selectedImage: File | null = null;
  selectedImageUrl!: string; hovering: boolean = false; // حالة التمرير فوق زر تغيير الصورة
  profileForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private topScreenServices: TopScreenService,
    private profileService: ProfileService,
    private loginService: LoginService,
    private sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      password: [''],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
    });
    this.GetProfileByUserId();
  }
  triggerImageUpload(): void {
    const imageInput = document.querySelector('#imageInput') as HTMLInputElement;
    debugger
    imageInput?.click(); // فتح نافذة اختيار الصور
  }


  onImageSelected(event: any) {
    debugger
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageUrl = e.target.result; // تحديث مصدر الصورة
    };
    if (file) {
      this.selectedImageUrl = URL.createObjectURL(file); // Generate a preview URL
      this.selectedImage = file; // Store the selected file for upload
    }
  }

  generateRandomCredentials(): void {
    this.showLoader = true;
    this.profileForm.patchValue({
      password: this.sharedService.generateRandomString(12) // Generate a 12 character password
    });
    this.showLoader = false;
  }
  updatePassword(): void {
    this.showLoader = true; if (!this.selectedImage) {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار صوره',
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      this.showLoader = false;
      return;
    }
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('passWord', this.profileForm.value.password);
      formData.append('arName', this.profileForm.value.arName);
      formData.append('enName', this.profileForm.value.enName);
      formData.append('imageDto', this.selectedImage, this.selectedImage.name);
      const observer = {
        next: (res: any) => {
          const newImageUrl = `${environment.dirUrl}imageProfile/${res.Data.imageDto}`;
          this.selectedImageUrl = newImageUrl;
          this.selectedImage = new File([],res.Data.imageDto);

          this.topScreenServices.updateImageUrl(newImageUrl,res.Data.arName);
          this.loginService.deleteToken();
          this.loginService.saveToken(res.Data.token)
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
      this.topScreenServices.updatePassword(formData).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'success',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  cleanFileName(fileName: string): string {
    // استخدم التعبير العادي لإزالة الجزء الزائد بناءً على النمط
    return fileName.replace(/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/, '');
  }
  GetProfileByUserId() {
    debugger
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data.imageDto}`;
          this.selectedImage = new File([],res.Data.imageDto);
          this.profileForm.patchValue({
            password: res.Data.password,
            arName: res.Data.arName,
            enName: res.Data.enName,
          });
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.profileService.GetProfileByUserId().subscribe(observer);
  }
}
