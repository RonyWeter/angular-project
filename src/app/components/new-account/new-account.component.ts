import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { FunctionsService } from '../../services/functions.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,MatInputModule,LoaderComponent,CommonModule],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.css'
})
export class NewAccountComponent implements OnInit{

   customerId : any;

   AccountForm = new FormGroup({
    customerId: new FormControl('', [
      Validators.required
    ]),
    accountName: new FormControl('', [
      Validators.required
    ]),
    initialAmount: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(private router : Router,
              private service : BankService,
              private functionService: FunctionsService,
              private snackBar: MatSnackBar 
              ){}

  ngOnInit(): void {
   this.customerId = history.state.customerId;
   this.AccountForm.controls['customerId'].setValue(this.customerId);
  }

  cancel(){
    this.router.navigate(['updateCustomer'],{state:{customerId:this.customerId}});
  }

  save(values : any){
  if (this.AccountForm.valid) {
    let initialAmmout = this.AccountForm.controls['initialAmount']?.value;
    if(Number(initialAmmout) > 0){
      this.service.createAccount(values).then(r=>{
        if(r.status_code == 200){
          const snackBarRef = this.snackBar.open('Success', '', {
            duration: 500,
          });
          snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['updateCustomer'],{state:{customerId:this.customerId}});
          });
        }
      }).catch(e=>{
        this.functionService.alert(e);
      });
    }else{
      this.functionService.alert("Amount shoud be bigger then 0");
      this.AccountForm.controls['initialAmount'].setValue('');
    }
    
  } 
  else {
    this.functionService.alert("Please fill all fields");
  }
  }

}
