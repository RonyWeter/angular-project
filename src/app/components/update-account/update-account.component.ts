import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../common/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BankService } from '../../services/bank.service';
import { transactions } from '../../models/transactions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupComponent } from '../../common/popup/popup.component';
import { FunctionsService } from '../../services/functions.service';
import { CommonModule } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, MatInputModule, MatMomentDateModule, MatTableModule, MatDatepickerModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent implements OnInit {
  data: any;
  accountId: any;
  customerId: any;
  transaction: transactions[] = [];
  displayedColumns: string[] = ['tranxId', 'tranxType', 'tranxAmount', 'notes', 'toAccountId', 'tranxDate'];
  dataSource = new MatTableDataSource<transactions>(this.transaction);

  transactionForm = new FormGroup({
    accountId: new FormControl('', [
      Validators.required
    ]),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  constructor(private service: BankService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private functionService: FunctionsService
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs
  }

  ngOnInit(): void {
    this.data = history.state.element;
    this.accountId = this.data.accountId;
    this.customerId = this.data.customerId;
    this.transactionForm.controls['accountId'].setValue(this.accountId);
    let data = {
      "accountId": this.accountId,
      "startDate": "1000-02-02",
      "endDate": "5000-02-02"
    }
    this.getAllTransactions(data);
  }


  getAllTransactions(data: any) {
    this.service.getTransactions(data).then(r => {
      if (r.status_code == 200) {
        this.transaction = r.data;
        for (let i = 0; i < this.transaction.length; i++) {
          if (this.transaction[i].tranxType == 'd') {
            this.transaction[i].tranxType = 'Deposit';
          }
          else if (this.transaction[i].tranxType == 'w') {
            this.transaction[i].tranxType = 'Withdrawal'
          }
          else if (this.transaction[i].tranxType == 't') {
            this.transaction[i].tranxType = 'Transfer'
          }
          const dateString = this.transaction[i].tranxDate;
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedMonth = month < 10 ? '0' + month : month;
          const formattedDay = day < 10 ? '0' + day : day;
          const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

          this.transaction[i].tranxDate = formattedDate;
        }
        this.dataSource = new MatTableDataSource<transactions>(this.transaction);
      } else if (r.status_code == 201) {
        this.transaction = [];
        this.dataSource = new MatTableDataSource<transactions>(this.transaction);
        this.functionService.alert(r.message);
      }
    }).catch(e => {

    });
  }

  back() {
    this.router.navigate(['updateCustomer'], { state: { customerId: this.customerId } });
  }
  getSpecificTranx() {
    let startDateX: any = this.transactionForm.controls['startDate']?.value;
    let endDateX: any = this.transactionForm.controls['endDate']?.value;

    let yearOfEndDate = endDateX._i.year;
    let monthOfEndDate: any;
    let dayOfEndDate: any;
    if ((Number(endDateX._i.month) + 1) > 9) {
      monthOfEndDate = (Number(endDateX._i.month) + 1);
    }
    else {
      monthOfEndDate = "0" + (Number(endDateX._i.month) + 1);
    }

    if ((Number(endDateX._i.date) + 1) > 9) {
      dayOfEndDate = Number(endDateX._i.date);
    }
    else {
      dayOfEndDate = "0" + Number(endDateX._i.date);
    }
    let endDate: any = yearOfEndDate + "-" + monthOfEndDate + "-" + dayOfEndDate;
    let yearOfStartDate = startDateX._i.year;
    let monthOfStartDate: any;
    let dayOfStartDate: any;

    if ((Number(startDateX._i.month) + 1) > 9) {
      monthOfStartDate = (Number(startDateX._i.month) + 1);
    }
    else {
      monthOfStartDate = "0" + (Number(startDateX._i.month) + 1);
    }

    if ((Number(startDateX._i.date) + 1) > 9) {
      dayOfStartDate = Number(startDateX._i.date);
    }
    else {
      dayOfStartDate = "0" + Number(startDateX._i.date);
    }
    let startDate: any = yearOfStartDate + "-" + monthOfStartDate + "-" + dayOfStartDate;

    if (startDate != "" && endDate != "") {

      let str = "";
      str = str + "\"" + "accountId" + "\"" + ":" + this.accountId + "" + "," + "\"" + "startDate" + "\"" + ":\"" + startDate + "\"" + "," + "\"" + "endDate" + "\"" + ":\"" + endDate + "\"";
      str = "{" + str + "}";
      this.getAllTransactions(JSON.parse(str));
    }
  }

  createTransaction() {
    this.router.navigate(['newTransaction'], { state: { element: this.data } })
  }

  delete() {
    this.popup();
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
        let str = "";
        str = str + "\"" + "accountId" + "\"" + ":" + this.accountId + "" + "," + "\"" + "customerId" + "\"" + ":" + this.customerId + "";
        str = "{" + str + "}";

        this.service.deleteAccount(JSON.parse(str)).then(r => {
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
              this.router.navigate(['updateCustomer'], { state: { customerId: this.customerId } });
            });
          } else {
            this.functionService.alert(r.message);
          }
        }).catch(e => {

        });
      }
      else {
      }
    });
  }

  downloadPdf() {
    const data = this.transaction;
    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'List Of All Transactions', style: ['header'] },
        '\n\n',
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              ['Transaction ID', 'Transaction Type', 'Transaction Amount', 'Notes', 'To Account ID', 'Transaction Date'],
              ...data.map(item => [item.tranxId, item.tranxType, item.tranxAmount, item.notes, item.toAccountId, item.tranxDate])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#0072bb',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        }
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download('transactions.pdf');
    pdfDocGenerator.getBlob((blob) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });


  }
}
