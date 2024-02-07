import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { HeaderComponent } from '../../common/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FunctionsService } from '../../services/functions.service';
@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, HeaderComponent],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {

  ngOnInit(): void { }

  constructor(
    private router: Router,
    private service: BankService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private functionService: FunctionsService
  ) { }

  CustomerForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required
    ]),
    idCard: new FormControl('', [
      Validators.required
    ]),
    accountName: new FormControl('', [
      Validators.required
    ]),
    initialAmount: new FormControl('', [
      Validators.required
    ]),
  });

  cancel() {
    this.router.navigate(['customers']);
  }

  save(values: any) {
    if (this.CustomerForm.valid) {
      let initialAmmout = this.CustomerForm.controls['initialAmount']?.value;
      if (Number(initialAmmout) > 0) {
        this.service.createCustomer(values).then(r => {
          if (r.status_code == 200) {
            const snackBarRef = this.snackBar.open('Success', '', {
              duration: 500,
            });
            snackBarRef.afterDismissed().subscribe(() => {
              this.router.navigate(['customers']);
            });
          }
          else if(r.status_code == 400){
            this.functionService.alert(r.message);
            this.CustomerForm.controls['idCard'].setValue('');
          }
          else{
            this.functionService.alert(r.message);
          }
        }).catch(e => {
          this.functionService.alert(e)
        });
      } else {
        this.functionService.alert("Amount shoud be bigger then 0")
        this.CustomerForm.controls['initialAmount'].setValue('');
      }

    }
    else {
      this.functionService.alert("Please fill all fields")
    }
  }


}
