import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  message: string = "Are you sure?"
  constructor(
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<PopupComponent>
             ){
    if (data) {
      this.message = data.message || this.message;
    }
  }


}
