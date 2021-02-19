// import { Pipe, PipeTransform } from '@angular/core';

import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform,NgZone } from '@angular/core';
// import { AsyncPipe } from '@angular/common';

// import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/delay';
// import { repeatWhen, takeWhile, map, tap } from 'rxjs/operators';

// import {distanceInWordsToNow, isFuture ,getTime,differenceInMinutes} from 'date-fns';


@Pipe({
  name: 'customTimeAgo',
  pure:false
})
export class CustomTimeAgoPipe implements PipeTransform, OnDestroy  {

  private timer: number;
	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}
	transform(value:string| number  | Date) {


    // 		// error trapping - return empty string if input is a problem
		if (!value) { return '' }
		if (!(typeof value === 'number' || typeof value === 'string' || value instanceof Date)) {
			return '';
		}
	
		this.removeTimer();
		let d = new Date(value);
    let now = new Date();
    
    if (now.getTime() - d.getTime() < 0) {
			return ''
		}
		let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
		let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) *1000;
		this.timer = this.ngZone.runOutsideAngular(() => {
			if (typeof window !== 'undefined') {
				return window.setTimeout(() => {
					this.ngZone.run(() => this.changeDetectorRef.markForCheck());
				}, timeToUpdate);
			}
			return null;
		});
		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));
		if (Number.isNaN(seconds)){
			return '';
		} else if (seconds <= 45) {
			return 'a few seconds ago';
		} else if (seconds <= 90) {
      // return 'a minute ago';
      return '1m ago';
		} else if (minutes <= 45) {
      // return minutes + ' minutes ago';
      return minutes + 'm ago';
		} else if (minutes <= 90) {
      // return 'an hour ago';
      return '1h ago';
		} else if (hours <= 22) {
      // return hours + ' hours ago';
      return hours + 'h ago';
		} else if (hours <= 36) {
      // return 'a day ago';
      return '1d ago';
		} else if (days <= 25) {
      // return days + ' days ago';
      return days + 'd ago';
		} else if (days <= 45) {
      // return 'a month ago';
      return '1m ago';
		} else if (days <= 345) {
      // return months + ' months ago';
      return months + 'm ago';
		} else if (days <= 545) {
      // return 'a year ago';
      return '1y ago';
		} else { // (days > 545)
      // return years + ' years ago';
      // return years + 'y ago';
      return this.getDateAsString(d);
		}
	}
	ngOnDestroy(): void {
		this.removeTimer();
  }
  
  private getDateAsString(d) {
    let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear();
    //  + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
  }
	private removeTimer() {
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}
	}
	private getSecondsUntilUpdate(seconds:number) {
		let min = 60;
		let hr = min * 60;
		let day = hr * 24;
		if (seconds < min) { // less than 1 min, update every 2 secs
			return 2;
		} else if (seconds < hr) { // less than an hour, update every 30 secs
			return 30;
		} else if (seconds < day) { // less then a day, update every 5 mins
			return 300;
		} else { // update every hour
			return 3600;
		}
	}
}
