import { RunStatus } from "./run-status.enum";
import { Driver } from "selenium-webdriver/edge";
import { Order } from "./order.model";

export class DriverRun {
	id: string;
	runStatus: RunStatus;
	driverId: string;
	driver: Driver
	orderId: number;
	order: Order;
	scheduledDatetime: Date;
	startDateTime: Date;
	endDateTime: Date;
	description: string;
	updatedDate: Date;
	note: string;
	price: number;
	isActive: boolean;
	isCod: boolean;
}