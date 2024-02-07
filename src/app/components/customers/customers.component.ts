import { Component, OnInit } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Customers } from '../../models/customers';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../common/header/header.component';
import { FunctionsService } from '../../services/functions.service';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, CommonModule,HeaderComponent,LoaderComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})

export class CustomersComponent implements OnInit {

  loader = true;
  customers: Customers[] = [];
  displayedColumns: string[] = ['customerId', 'fullName', 'idCard'];
  dataSource = new MatTableDataSource<Customers>(this.customers);

  SearchForm = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private service: BankService,
    private router: Router,
    private functionService: FunctionsService 
  ) { }

  ngOnInit(): void {
    this.getCustomers("");
    this.SearchForm.get('search')?.valueChanges.subscribe((r: any) => {
    this.Search(r);
    })
  }

  timer: any;
  Search(r: string) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getCustomers(r.trim());
    }, 500);
  }

  getCustomers(searchText: any) {
    this.loader=true;
    this.service.getCustomers(searchText).then(r => {
      if (r.status_code == 200) {
        this.customers = r.data;
        this.dataSource = new MatTableDataSource<Customers>(this.customers);
      } else if (r.status_code == 201) {
        this.customers = [];
        this.dataSource = new MatTableDataSource<Customers>(this.customers);
      }
      setTimeout(() => {
        this.loader=false;
      }, 300);
    }).catch(e => {
      this.loader=false;
      this.functionService.alert("Something wrong Please refresh !!");
    });
  }

  createCutomer() {
    this.router.navigate(['newCustomer']);
  }

  updateCustomer(element : Customers){
    this.router.navigate(['updateCustomer'],{state:{customerId:element.customerId}});
  }


}
