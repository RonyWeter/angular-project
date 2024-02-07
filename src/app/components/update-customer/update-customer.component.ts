import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BankService } from '../../services/bank.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Accounts } from '../../models/accounts';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../common/popup/popup.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FunctionsService } from '../../services/functions.service';
import { LoaderComponent } from '../../common/loader/loader.component';


@Component({
  selector: 'app-update-customer',
  standalone: true,
  imports: [CommonModule,LoaderComponent, HeaderComponent, ReactiveFormsModule, MatInputModule, MatTableModule, MatSnackBarModule],
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent implements OnInit {
  customerId: any;
  accountId: any;
  accounts: Accounts[] = [];
  displayedColumns: string[] = ['accountId', 'accountName', 'balance'];
  dataSource = new MatTableDataSource<Accounts>(this.accounts);

  CustomerForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required
    ]),
    idCard: new FormControl('', [
      Validators.required
    ]),
    customerId: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private service: BankService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private functionService: FunctionsService
    ) { }

  ngOnInit(): void {
    this.customerId = history.state.customerId;
    this.getCustomerInfo(this.customerId);
  }

  getCustomerInfo(customerId: any) {
    this.service.getCustomerInfo(customerId).then(r => {
      if (r.status_code == 200) {
        let customerId: any = r.data.customerId
        let fullName: any = r.data.fullName
        let idCard: any = r.data.idCard
        this.CustomerForm.controls['fullName'].setValue(fullName);
        this.CustomerForm.controls['idCard'].setValue(idCard);
        this.CustomerForm.controls['customerId'].setValue(customerId);

        this.accounts = r.data.accounts;
        this.dataSource = new MatTableDataSource<Accounts>(this.accounts);
      } else if (r.status_code == 201) {
        this.functionService.alert(r.message);
      }
    }).catch(e => {
      this.functionService.alert(e);
    });
  }

  delete() {
    this.popup();
  }

  createAccount() {
    this.router.navigate(['newAccount'], { state: { customerId: this.customerId } });
  }

  back() {
    this.router.navigate(['customers']);
  }

  updateAccount(element: any) {
    this.router.navigate(['updateAccount'], { state: { element: element } });
  }

  popup() {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        message: 'Are you sure you want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteCustomer(this.customerId).then(r => {
          if (r.status_code == 200) {
            this.snackBar.dismiss();
            const a = document.createElement('a');
            a.click();
            a.remove();
            this.snackBar.dismiss();
            const snackBarRef = this.snackBar.open('Success', '', {
              duration: 500,
            })
            snackBarRef.afterDismissed().subscribe(() => {
              this.router.navigate(['customers']);
            });
          } else if (r.status_code == 201) {
            this.functionService.alert(r.message);
          }
        }).catch(e => {
          this.functionService.alert(e);
        });
      }
      else {
      }
    });
  }

}
