import { Driver } from "./driver.model";
import { Shop } from "./shop.model";

export class DriverShop {
	driverId: number;
	driver: Driver
	shopId: number;
	shop: Shop;
	createdDate: Date;
	updatedDate: Date;
	completedRunCount: number;
	balanceAmount: number;
	defaultPrepareMinutes: number;
}