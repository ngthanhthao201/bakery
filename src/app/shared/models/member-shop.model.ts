import { Member } from "./member.model";
import { Shop } from "./shop.model";
import { ShopRole } from "./shop-role.model";

export class MemberShop{
    public memberId: number;
    public shopId: number;
    public roleId: number;

    public member: Member;
    public role: ShopRole;

}