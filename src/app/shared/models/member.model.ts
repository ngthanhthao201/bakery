import { MemberShop } from "./member-shop.model";
import { MemberClaim } from "./member-claim.model";
import { Gender } from "./gender.enum";
import { MemberShift } from "./member-shift.model";

export class Member{
    public id: number;
    public name:string;
    public image: string;
    public memberShops: MemberShop[];
    public memberClaims: MemberClaim[];
    public memberShifts: MemberShift[];
    public accessCode: string;
    public gender: Gender;
    public email: string;
    public username: string;
    public password: string;
    public roleIds :number[]

}