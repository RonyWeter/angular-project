import { BaseResponse } from "./base-response";
import { Customers } from "./customers";

export class GetCustomerInfo extends BaseResponse{

    data:Customers = new Customers();
}