import { Component, OnInit, numberAttribute } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { FunctionsService } from '../../services/functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, MatInputModule, MatSelectModule, CommonModule],
  providers:[DatePipe],
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.css'
})
export class NewTransactionComponent implements OnInit {

  selected = '';
  toAccount = false;
  customerId: any;
  accountId: any;
  data: any;

  TransactionForm = new FormGroup({
    tranxType: new FormControl('', [
      Validators.required
    ]),
    tranxAmount: new FormControl('', [
      Validators.required
    ]),
    toAccountId: new FormControl(''),
    notes: new FormControl(''),
  });

  constructor(private router: Router,
              private datePipe: DatePipe,
              private service : BankService,
              private functionService: FunctionsService,
              private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.toAccount = false;
    this.data = history.state.element;
    this.customerId = this.data.customerId;
    this.accountId = this.data.accountId;

  }

  save(value: any) {
    let transactionAmount = this.TransactionForm.controls['tranxAmount']?.value;
    let transactionType = this.TransactionForm.controls['tranxType']?.value;
    let notes = this.TransactionForm.controls['notes']?.value;
    let toAccountId : any = this.TransactionForm.controls['toAccountId']?.value;
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.TransactionForm.valid) {
      if (Number(transactionAmount) <= 0) {
        this.functionService.alert("Amount Should Be a positive Number");
        this.TransactionForm.controls['tranxAmount'].setValue('');
      }
      else {
        if(toAccountId == 0 && transactionType == 't'){
         this.functionService.alert("Please Enter A Valid Account");
         this.TransactionForm.controls['toAccountId'].setValue('');
        }
        else{
          if(toAccountId == ''){
            toAccountId = 0;
          }
          let str = "";
          str = str + "\"" + "tranxType" + "\"" + ":\"" + transactionType + "\"" + "," + "\"" + "customerId" + "\"" + ":" + this.customerId + "" + "," + "\"" + "accountId" + "\"" + ":" + this.accountId + ""
            + "," + "\"" + "tranxAmount" + "\"" + ":" + transactionAmount + "" + "," + "\"" + "toAccountId" + "\"" + ":" + toAccountId + ""
            + "," + "\"" + "notes" + "\"" + ":\"" + notes + "\"" + "," + "\"" + "tranxDate" + "\"" + ":\"" + date + "\"";
          str = "{" + str + "}";
          this.service.createTransaction(JSON.parse(str)).then(r => {
            if (r.status_code == 200) {
              const snackBarRef = this.snackBar.open('Success', '', {
                duration: 500,
              });
              snackBarRef.afterDismissed().subscribe(() => {
                this.router.navigate(['updateAccount'],{state:{element:this.data}});
              });
            }
            else{
              this.functionService.alert(r.message);
            }
          }).catch(e => {
            this.functionService.alert(e);
          });
        }
      }
    }
    else{
      this.functionService.alert("Fill Mendatory Fields")
    }

  }

  cancel() {
    this.router.navigate(['updateAccount'], { state: { element: this.data } });
  }

  getTransType() {
    let transactionType = this.TransactionForm.controls['tranxType']?.value;
    if (transactionType == "t") {
      this.toAccount = true;
      this.TransactionForm.controls['toAccountId'].setValidators(Validators.required);
      this.TransactionForm.controls['toAccountId'].updateValueAndValidity();
    }
    else {
      this.toAccount = false;
      this.TransactionForm.controls['toAccountId'].clearValidators();
      this.TransactionForm.controls['toAccountId'].updateValueAndValidity();
    }
  }
}
