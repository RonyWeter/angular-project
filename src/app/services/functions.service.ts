import { Inject, Injectable } from '@angular/core';
import { AlertComponent } from '../common/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private dialog : MatDialog) { }

   async alert(message : any){
    let x = 0 ;
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        message: message
      }
    });
    await new Promise(_resolve => {
      setTimeout(() => {
        dialogRef.close();
      }, 1500);
    });
  }
}
