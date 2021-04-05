import { Pipe, PipeTransform, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
	name: 'timeAgo',
	pure: false
})
export class TimeAgoPipe implements PipeTransform {



	transform(obj: any) {
		var value = new Date(obj);;
		var result: string;
		// current time
		let now = new Date().getTime();

		// time since message was sent in seconds
		let seconds = (now - value.getTime()) / 1000;
		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days / 30.416));
		let years = Math.round(Math.abs(days / 365));
		// format string
		if (seconds <= 45) {
			return 'vài giây trước'; //'a few seconds ago';
		} else if (seconds <= 90) {
			return 1 + ' phút trước'; //'a minute ago';
		} else if (minutes <= 45) {
			return minutes + ' phút trước';
		} else if (minutes <= 90) {
			return 1 + ' giờ trước'; //'an hour ago';
		} else if (hours <= 22) {
			return hours + ' giờ trước';
		} else if (hours <= 36) {
			return '1 ngày trước'; //'a day ago';
		} else if (days <= 25) {
			return days + ' ngày trước';
		} else if (days <= 45) {
			return 1 + ' tháng trước';//'a month ago';
		} else if (days <= 345) {
			return months + ' tháng trước' //months + ' months ago';
		} else if (days <= 545) {
			return 1 + ' năm trước'; //'a year ago';
		} else { // (days > 545)
			return years + ' năm trước'// years + ' years ago';
		}


	};
}