import { Pipe, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { AsyncPipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'timeAgoBarcode',
    pure: false
})
export class TimeAgoBarcodePipe extends AsyncPipe {
    value: Date;
    timer: Observable<any>;

    constructor(ref: ChangeDetectorRef, private sanitized: DomSanitizer) {
        super(ref);
    }

    transform(obj: any): any {
        obj = new Date(obj);
        if (obj instanceof Date) {
            this.value = obj;

            if (!this.timer) {
                this.timer = this.getObservable();
            }

            return super.transform(this.timer);
        }

        return super.transform(obj);
    }

    private getObservable() {
        return Observable.interval(1000).startWith(0).map(() => {
            var result: string;
            // current time
            let now = new Date().getTime();

            // time since message was sent in seconds
            let seconds = (now - this.value.getTime()) / 1000;
            let minutes = Math.round(Math.abs(seconds / 60));
            let hours = Math.round(Math.abs(minutes / 60));
            let days = Math.round(Math.abs(hours / 24));
            let months = Math.round(Math.abs(days / 30.416));
            let years = Math.round(Math.abs(days / 365));
            // format string
            if (seconds <= 45) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #c6ff00;">vài giây trước</span>`); //'a few seconds ago';
            } else if (seconds <= 90) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00e05d;">1 phút trước</span>`); //'a minute ago';
            } else if (minutes <= 45) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00e05d;">` + minutes + ` phút trước</span>`);
            } else if (minutes <= 90) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00c853;">1 giờ trước</span>`); //'an hour ago';
            } else if (hours <= 22) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00c853;">` + hours + ` giờ trước</span>`);
            } else if (hours <= 36) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #037d36;">1 ngày trước</span>`); //'a day ago';
            } else if (days <= 25) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">` + days + ` ngày trước</span>`);
            } else if (days <= 45) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">1 tháng trước</span>`);//'a month ago';
            } else if (days <= 345) {
                return months + ' tháng trước' //months + ' months ago';
            } else if (days <= 545) {
                return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">1 năm trước</span>`); //'a year ago';
            } else { // (days > 545)
                return years + ' năm trước'// years + ' years ago';
            }

        });
    };
}


// import {Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy} from "@angular/core";
// import { DomSanitizer } from "@angular/platform-browser";
// @Pipe({
// 	name:'timeAgoBarcode',
// 	pure:false
// })
// export class TimeAgoBarcodePipe implements PipeTransform, OnDestroy {
// 	private timer: number;
// 	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone, private sanitized: DomSanitizer) {}
// 	transform(value:string) {
// 		this.removeTimer();
// 		let d = new Date(value);
// 		let now = new Date();
// 		let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
// 		let timeToUpdate = this.getSecondsUntilUpdate(seconds) *1000;
// 		this.timer = this.ngZone.runOutsideAngular(() => {
// 			if (typeof window !== 'undefined') {
// 				return window.setTimeout(() => {
// 					this.ngZone.run(() => this.changeDetectorRef.markForCheck());
// 				}, 1000 * 10);
// 			}
// 			return null;
// 		});
// 		let minutes = Math.round(Math.abs(seconds / 60));
// 		let hours = Math.round(Math.abs(minutes / 60));
// 		let days = Math.round(Math.abs(hours / 24));
// 		let months = Math.round(Math.abs(days/30.416));
// 		let years = Math.round(Math.abs(days/365));
// 		if (seconds <= 45) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #c6ff00;">vài giây trước</span>`); //'a few seconds ago';
// 		} else if (seconds <= 90) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00e05d;">1 phút trước</span>`); //'a minute ago';
// 		} else if (minutes <= 45) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00e05d;">` +  minutes +` phút trước</span>`); 
// 		} else if (minutes <= 90) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00c853;">1 giờ trước</span>`); //'an hour ago';
// 		} else if (hours <= 22) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #00c853;">` +  hours +` giờ trước</span>`);
// 		} else if (hours <= 36) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #037d36;">1 ngày trước</span>`); //'a day ago';
// 		} else if (days <= 25) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">` +  days +` ngày trước</span>`);
// 		} else if (days <= 45) {
// 			return  this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">1 tháng trước</span>`);//'a month ago';
// 		} else if (days <= 345) {
// 			return months + ' tháng trước' //months + ' months ago';
// 		} else if (days <= 545) {
// 			return this.sanitized.bypassSecurityTrustHtml(`<span style="color: #ff8a80;">1 năm trước</span>`); //'a year ago';
// 		} else { // (days > 545)
// 			return years +' năm trước'// years + ' years ago';
// 		}
// 	}
// 	ngOnDestroy(): void {
// 		this.removeTimer();
// 	}
// 	private removeTimer() {
// 		if (this.timer) {
// 			window.clearTimeout(this.timer);
// 			this.timer = null;
// 		}
// 	}
// 	private getSecondsUntilUpdate(seconds:number) {
// 		let min = 60;
// 		let hr = min * 60;
// 		let day = hr * 24;
// 		if (seconds < min) { // less than 1 min, update ever 2 secs
// 			return 2;
// 		} else if (seconds < hr) { // less than an hour, update every 30 secs
// 			return 30;
// 		} else if (seconds < day) { // less then a day, update every 5 mins
// 			return 300;
// 		} else { // update every hour
// 			return 3600;
// 		}
// 	}
// }