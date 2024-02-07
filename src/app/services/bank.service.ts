import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCustomersResponse } from '../models/get-customers-response';
import { BaseResponse } from '../models/base-response';
import { transactions } from '../models/transactions';
import { GetCustomerInfo } from '../models/get-customer-info';
import { GetTransactionsResponse } from '../models/get-transactions-response';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }

  getCustomers(params: any): Promise<GetCustomersResponse> {
    return this.http.get<any>('http://localhost:8080/api/getCustomersByFullNamePrefix',
      { params: { "prefix": params } }).toPromise();
  }

  createCustomer(data: any): Promise<BaseResponse> {
    return this.http.post<any>('http://localhost:8080/api/createCustomer',data).toPromise();
  }

  getCustomerInfo(customerId: any): Promise<GetCustomerInfo> {
    return this.http.get<any>('http://localhost:8080/api/getCustomerInfo',
      { params: { "customerId": customerId } }).toPromise();
  }

  deleteCustomer(customerId: any): Promise<BaseResponse> {
    return this.http.delete<any>('http://localhost:8080/api/deleteCustomer',
      { params: { "customerId": customerId } }).toPromise();
  }

  deleteAccount(data: any): Promise<BaseResponse> {
    return this.http.post<any>('http://localhost:8080/api/deleteAccount',data).toPromise();
  }

  getTransactions(data:any): Promise<GetTransactionsResponse> {
    return this.http.post<any>('http://localhost:8080/api/getTransactions',data).toPromise();
  }

  createTransaction(data:any): Promise<BaseResponse> {
    return this.http.post<any>('http://localhost:8080/api/createTransaction',data).toPromise();
  }

  createAccount(data:any): Promise<BaseResponse> {
    return this.http.post<any>('http://localhost:8080/api/createAccount',data).toPromise();
  }
}

