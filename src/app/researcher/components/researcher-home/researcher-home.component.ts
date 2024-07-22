import { Component } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';

@Component({
  selector: 'app-researcher-home',
  templateUrl: './researcher-home.component.html',
  styleUrls: ['./researcher-home.component.css']
})
export class ResearcherHomeComponent {
  username: string = '';
  password: string = '';
  constructor(private researcherService:ResearcherHomeService) {}

  ngOnInit(): void {
    this.username = this.generateRandomString(8); // Generate an 8 character username
    this.generateRandomCredentials();
  }

  generateRandomCredentials(): void {
    this.password = this.generateRandomString(12); // Generate a 12 character password
  }

  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  saveResearcher(): void {
    // Your save logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
