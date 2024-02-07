import { BaseResponse } from "./base-response";
import { Customers } from "./customers";

export class GetCustomersResponse extends BaseResponse {
    data: Customers[] = [];
}