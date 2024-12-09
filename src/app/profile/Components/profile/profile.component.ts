import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  showLoader: boolean = false;
  selectedImageUrl: string | null = null; // مصدر الصورة المختارة
  hovering: boolean = false; // حالة التمرير فوق زر تغيير الصورة

  triggerImageUpload(): void {
    debugger
    const imageInput = document.querySelector('#imageInput') as HTMLInputElement;
    imageInput?.click(); // فتح نافذة اختيار الصور
  }

  onImageSelected(event: Event): void {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result; // تحديث مصدر الصورة
      };
      reader.readAsDataURL(input.files[0]);
    }
  }


}
