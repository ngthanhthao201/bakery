export class MemberClaim{
    constructor(name: string, claimType: string, claimValue: string, shopId: number){
        this.name = name;
        this.claimType = claimType;
        this.claimValue = claimValue;
        this.shopId = shopId;
    }
    public name: string;
    public id: number;
    public claimType:string;
    public claimValue: string;
    public memberId: number;
    public shopId: number;
}