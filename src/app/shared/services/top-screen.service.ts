import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopScreenService {
  private researcherId: string = '';

  setResearcherId(id: string): void {
    this.researcherId = id;
  }

  getResearcherId(): string {
    return this.researcherId;
  }
}
