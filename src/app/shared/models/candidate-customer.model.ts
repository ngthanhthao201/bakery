import { CustomerSearchResult } from "./customer-search-result.model";
import { Order } from "./order.model";
import { IncomeHeader } from "./income-header.model";
import { CustomerCandidateAudit } from "./customer-candidate-audit.model";

export class CandidateCustomer extends CustomerSearchResult{
    candidateOrder : Order;
    candidateIncomeHeader : IncomeHeader;

    customerCandidateAudit : CustomerCandidateAudit;
    returnedOrderId : number;
    isReturned: boolean;
}