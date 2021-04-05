import { CakeStatus } from "./cake-status.enum";
import { Member } from "./member.model";

export class OrderCakeStatus {
    id: number;
    cakeStatus: CakeStatus;
    memberId : number;
    member: Member;
    updatedDate: Date;
  }

