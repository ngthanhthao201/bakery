import { DriverRun } from "./driver-run.model";
import { DriverShop } from "./driver-shop.model";

export class Driver {
	id: string;
	email: string;
	phoneNumber: string;
	name: string;
	image: string;
	isActive: boolean;
	password: string;
	diverRuns: DriverRun[];
	driverShops: DriverShop[];

}