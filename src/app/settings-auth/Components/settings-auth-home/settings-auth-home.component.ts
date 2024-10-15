import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings-auth-home',
  templateUrl: './settings-auth-home.component.html',
  styleUrls: ['./settings-auth-home.component.css']
})
export class SettingsAuthHomeComponent {
  showLoader: boolean = false;
  authForm!: FormGroup;

}
