import { BaseResponse } from "./base-response";

export class transactions extends BaseResponse{
    tranxId:     number =0;
    tranxType:    string ="";
    customerId:  number=0;
    accountId:   number=0;
    tranxAmount: number=0;
    toAccountId: number=0;
    notes:       string="";
    tranxDate:   any;
}