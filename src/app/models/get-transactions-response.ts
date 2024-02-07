import { BaseResponse } from "./base-response";
import { transactions } from "./transactions";


export class GetTransactionsResponse extends BaseResponse {
    data: transactions[] = [];
}