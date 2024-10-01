import { Component, Input } from '@angular/core';
import { IMessage } from '../../Dtos/MessageDto';

@Component({
  selector: 'app-tabel-messages',
  templateUrl: './tabel-messages.component.html',
  styleUrls: ['./tabel-messages.component.css']
})
export class TabelMessagesComponent {
  @Input() messages: IMessage[] = [];
  getTypeMessage(typeMessage: number): string {
    switch (typeMessage) {
      case 1:
        return 'رساله';
      case 2:
        return 'ايميل';
      case 3:
        return 'اشعار';
      default:
        return '';
    }
  }
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0];
  }
}
