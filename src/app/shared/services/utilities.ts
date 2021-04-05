// ======================================



// 

// ======================================

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import * as _ from 'lodash';
import { Order } from '../models/order.model';
import { Shop } from '../models/shop.model';
import { ProductCategory } from '../models/product-category.model';
import * as moment from 'moment';
import { Review } from '../models/review.model';
import { DatePipe } from '@angular/common';
import { isToday } from 'date-fns';

@Injectable()
export class Utilities {




    public static readonly captionAndMessageSeparator = ":";
    public static readonly noNetworkMessageCaption = "No Network";
    public static readonly noNetworkMessageDetail = "The server cannot be reached";
    public static readonly accessDeniedMessageCaption = "Access Denied!";
    public static readonly accessDeniedMessageDetail = "";
    public static readonly customerWebsiteUrl = "https://tiembanhngon.com/"



    public static getReviewUrl(review: Review): any {
        return "https://tiembanhngon.com/reviews/" + review.reviewCodeId;
    }

    public static replaceImageLink(link: string, w: number, h: number) {
        if (link && link.indexOf('/thumbs/') > -1) {
            var lastIndex = link.lastIndexOf("?");
            if (lastIndex == -1) lastIndex = link.length;
            var blobContainer = link.substring(link.lastIndexOf("/thumbs/") + 1, lastIndex);
            return 'https://mbimageresizer.azurewebsites.net/' + blobContainer + '?w=' + w + '&h=' + h + '&autorotate=true';
        }
        return link;
    }

    public static isImage(src: string): boolean {
        if(!src) {
            return false;
        }
        return src.endsWith(".jpeg") || src.endsWith(".jpg") || src.endsWith(".png");
    }

    public static isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    public static buildRoomNameFromOrder(order: Order, currentShopId) {
        return order.customer.id + "-" + order.id + "-" + currentShopId;
    }

    public static getCategoryUrlWebsite(shop: Shop, category: ProductCategory) {
        return this.customerWebsiteUrl + "shop/" + shop.name.replace(' ', '-') + "/" + category.id;
    }

    public static getNumberOfPercent(total, percent) {
        return total * percent / 100;
    }

    public static getPreviousMonths(numberOfMonths): any {
        let monthsAsString = [];
        let months = [];
        let monthsRequired = numberOfMonths - 1;
        var start: Date;
        var end: Date;
        for (let i = monthsRequired; i >= 0; i--) {
            var month = moment().subtract(i, 'months');
            months.push(month);
            monthsAsString.push(month.format('MM-YYYY'))
        }
        return { monthsAsString: monthsAsString, months: months, start: start, end: end };
    }

    public static getPreviousWeeks(numberOfWeeks): any {
        let weeksAsString = [];
        let weeks = [];
        let weeksRequired = numberOfWeeks - 1;
        var start: Date;
        var end: Date;
        for (let i = weeksRequired; i >= 0; i--) {
            var week = moment().subtract(i, 'week');
            weeks.push(week);
            weeksAsString.push('Tuần ' + week.week())
        }
        return { weeksAsString: weeksAsString, weeks: weeks, start: start, end: end };
    }

    private static weekOfMonth(m) {
        return m.week() - moment(m).startOf('month').week();
    }

    public static getOrderIdFromRoomName(roomName: string) {
        return parseInt(roomName.split('-')[1]);
    }

    public static getFirstLetterOfEachWord(str: string) {
        if (!str) { return ''; }

        var first_letter = function (x) { if (x) { return x[0]; } else { return ''; } };

        return str.split(' ').map(first_letter).join('');
    }

    public static getHttpResponseMessage(data: Response | any): string[] {

        let responses: string[] = [];

        if (data instanceof Response) {

            if (this.checkNoNetwork(data)) {
                responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
            }
            else {
                try {
                    let responseObject = data.json();

                    if (typeof responseObject === 'object' || responseObject instanceof Object) {

                        for (let key in responseObject) {
                            if (key)
                                responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
                            else if (responseObject[key])
                                responses.push(responseObject[key].toString());
                        }
                    }
                }
                catch (error) {
                }
            }

            if (!responses.length && data.text())
                responses.push(`${data.statusText}: ${data.text()}`);
        }

        if (!responses.length)
            responses.push(data.toString());

        if (this.checkAccessDenied(data))
            responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);


        return responses;
    }


    public static findHttpResponseMessage(messageToFind: string, data: Response | any, seachInCaptionOnly = true, includeCaptionInResult = false): string {

        let searchString = messageToFind.toLowerCase();
        let httpMessages = this.getHttpResponseMessage(data);

        for (let message of httpMessages) {
            let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);

            if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
                return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
            }
        }

        if (!seachInCaptionOnly) {
            for (let message of httpMessages) {

                if (message.toLowerCase().indexOf(searchString) != -1) {
                    if (includeCaptionInResult) {
                        return message;
                    }
                    else {
                        let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);
                        return fullMessage.secondPart || fullMessage.firstPart;
                    }
                }
            }
        }

        return null;
    }


    public static checkNoNetwork(response: Response) {
        if (response instanceof Response) {
            return response.status == 0;
        }

        return false;
    }

    public static checkAccessDenied(response: Response) {
        if (response instanceof Response) {
            return response.status == 403;
        }

        return false;
    }

    public static checkNotFound(response: Response) {
        if (response instanceof Response) {
            return response.status == 404;
        }

        return false;
    }

    public static checkIsLocalHost(url: string, base?: string) {
        if (url) {
            let location = new URL(url, base);
            return location.hostname === "localhost" || location.hostname === "127.0.0.1";
        }

        return false;
    }



    public static getQueryParamsFromString(paramString: string) {

        if (!paramString)
            return null;

        let params: { [key: string]: string } = {};

        for (let param of paramString.split("&")) {
            let keyValue = Utilities.splitInTwo(param, "=");
            params[keyValue.firstPart] = keyValue.secondPart;
        }

        return params;
    }


    public static splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
        let separatorIndex = text.indexOf(separator);

        if (separatorIndex == -1)
            return { firstPart: text, secondPart: null };

        let part1 = text.substr(0, separatorIndex).trim();
        let part2 = text.substr(separatorIndex + 1).trim();

        return { firstPart: part1, secondPart: part2 };
    }


    public static safeStringify(object) {

        let result: string;

        try {
            result = JSON.stringify(object);
            return result;
        }
        catch (error) {

        }

        let simpleObject = {};

        for (let prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) == 'object') {
                continue;
            }
            if (typeof (object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }

        result = "[***Sanitized Object***]: " + JSON.stringify(simpleObject);

        return result;
    }


    public static JSonTryParse(value: string) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === "undefined")
                return void 0;

            return value;
        }
    }

    public static isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    public static TestIsUndefined(value: any) {
        return typeof value === 'undefined';
        //return value === undefined;
    }


    public static TestIsString(value: any) {
        return typeof value === 'string' || value instanceof String;
    }



    public static capitalizeFirstLetter(text: string) {
        if (text)
            return text.charAt(0).toUpperCase() + text.slice(1);
        else
            return text;
    }


    public static toTitleCase(text: string) {
        return text.replace(/\w\S*/g, (subString) => {
            return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
        });
    }


    public static toLowerCase(items: string)
    public static toLowerCase(items: string[])
    public static toLowerCase(items: any): string | string[] {

        if (items instanceof Array) {
            let loweredRoles: string[] = [];

            for (let i = 0; i < items.length; i++) {
                loweredRoles[i] = items[i].toLowerCase();
            }

            return loweredRoles;
        }
        else if (typeof items === 'string' || items instanceof String) {
            return items.toLowerCase();
        }
    }


    public static uniqueId() {
        return this.randomNumber(1000000, 9000000).toString();
    }

    public static uniqueIdNumber(length: number) {
        return Math.random().toString(36).substr(2, length).toUpperCase();
    }

    private static replaceAt(str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    public static generateIdNumberForOrder() {
        var result = Math.random().toString(36).substr(2, 3).toUpperCase();
        this.replaceAt(result, 1, Math.floor(Math.random() * 10));
        return result;
    }

    public static randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static normalizeString(str) {
        return str.normalize('NFD');
    }

    public static searchOnItem = function (item, value, ignoreList = [], searchOnFieldList = []) {
        return _.some(_.filter(item, function (valOnObject, key) {

            if(searchOnFieldList.length > 0 && searchOnFieldList.indexOf(key) < 0){
                return false;
            }

            if (typeof valOnObject == 'object' && ignoreList.indexOf(key) < 0) {
                return Utilities.searchOnItem(valOnObject, value, ignoreList, searchOnFieldList);
            } else {

                if (moment(valOnObject, moment.ISO_8601, true).isValid()) {
                    //console.log(val);
                    valOnObject = new DatePipe('vi-VN').transform(valOnObject, 'short');
                }

                var temp = String(valOnObject).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                var matches = temp.match(/\b(\w)/g); // ['J','S','O','N']
                var acronym = matches.join(''); // JSON

                //console.log(temp);
                var result = (temp.indexOf(value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > -1)  ;
                if(!result){
                   result = acronym.toLowerCase().indexOf(value.toLowerCase()) > -1;
                }
                return result ;
            }
        }));
    }


    // private static str_replace = function(search, replace, str){
    //     var ra = replace instanceof Array, sa = str instanceof Array, l = (search = [].concat(search)).length, replace = [].concat(replace), i = (str = [].concat(str)).length;
    //     while(j = 0, i--)
    //         while(str[i] = str[i].split(search[j]).join(ra ? replace[j] || "" : replace[0]), ++j < l);
    //     return sa ? str : str[0];
    // }

    // private static remove_vietnamese_accents = function (str)
    // {
    //    var accents_arr= new Array(
    //         "à","á","ạ","ả","ã","â","ầ","ấ","ậ","ẩ","ẫ","ă",
    //         "ằ","ắ","ặ","ẳ","ẵ","è","é","ẹ","ẻ","ẽ","ê","ề",
    //         "ế","ệ","ể","ễ",
    //         "ì","í","ị","ỉ","ĩ",
    //         "ò","ó","ọ","ỏ","õ","ô","ồ","ố","ộ","ổ","ỗ","ơ",
    //         "ờ","ớ","ợ","ở","ỡ",
    //         "ù","ú","ụ","ủ","ũ","ư","ừ","ứ","ự","ử","ữ",
    //         "ỳ","ý","ỵ","ỷ","ỹ",
    //         "đ",
    //         "À","Á","Ạ","Ả","Ã","Â","Ầ","Ấ","Ậ","Ẩ","Ẫ","Ă",
    //         "Ằ","Ắ","Ặ","Ẳ","Ẵ",
    //         "È","É","Ẹ","Ẻ","Ẽ","Ê","Ề","Ế","Ệ","Ể","Ễ",
    //         "Ì","Í","Ị","Ỉ","Ĩ",
    //         "Ò","Ó","Ọ","Ỏ","Õ","Ô","Ồ","Ố","Ộ","Ổ","Ỗ","Ơ",
    //         "Ờ","Ớ","Ợ","Ở","Ỡ",
    //         "Ù","Ú","Ụ","Ủ","Ũ","Ư","Ừ","Ứ","Ự","Ử","Ữ",
    //         "Ỳ","Ý","Ỵ","Ỷ","Ỹ",
    //         "Đ"
    //     );

    //   var  no_accents_arr= new Array(
    //         "a","a","a","a","a","a","a","a","a","a","a",
    //         "a","a","a","a","a","a",
    //         "e","e","e","e","e","e","e","e","e","e","e",
    //         "i","i","i","i","i",
    //         "o","o","o","o","o","o","o","o","o","o","o","o",
    //         "o","o","o","o","o",
    //         "u","u","u","u","u","u","u","u","u","u","u",
    //         "y","y","y","y","y",
    //         "d",
    //         "A","A","A","A","A","A","A","A","A","A","A","A",
    //         "A","A","A","A","A",
    //         "E","E","E","E","E","E","E","E","E","E","E",
    //         "I","I","I","I","I",
    //         "O","O","O","O","O","O","O","O","O","O","O","O",
    //         "O","O","O","O","O",
    //         "U","U","U","U","U","U","U","U","U","U","U",
    //         "Y","Y","Y","Y","Y",
    //         "D"
    //     );

    //     return str_replace(accents_arr,no_accents_arr,str);
    // }


    public static baseUrl() {
        if (window.location.origin)
            return window.location.origin

        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }


    public static printDateOnly(date: Date) {

        date = new Date(date);

        let dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        let monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

        let dayOfWeek = date.getDay();
        let dayOfMonth = date.getDate();
        let sup = "";
        let month = date.getMonth();
        let year = date.getFullYear();

        if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
            sup = "st";
        }
        else if (dayOfMonth == 2 || dayOfMonth == 22) {
            sup = "nd";
        }
        else if (dayOfMonth == 3 || dayOfMonth == 23) {
            sup = "rd";
        }
        else {
            sup = "th";
        }

        let dateString = dayNames[dayOfWeek] + ", " + dayOfMonth + sup + " " + monthNames[month] + " " + year;

        return dateString;
    }

    public static printTimeOnly(date: Date) {

        date = new Date(date);

        let period = "";
        let minute = date.getMinutes().toString();
        let hour = date.getHours();

        period = hour < 12 ? "AM" : "PM";

        if (hour == 0) {
            hour = 12;
        }
        if (hour > 12) {
            hour = hour - 12;
        }

        if (minute.length == 1) {
            minute = "0" + minute;
        }

        let timeString = hour + ":" + minute + " " + period;


        return timeString;
    }

    public static printDate(date: Date, separator = "at") {
        return `${Utilities.printDateOnly(date)} ${separator} ${Utilities.printTimeOnly(date)}`;
    }


    public static printFriendlyDate(date: Date, separator = "-") {
        let today = new Date(); today.setHours(0, 0, 0, 0);
        let yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        let test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (test.toDateString() == today.toDateString())
            return `Today ${separator} ${Utilities.printTimeOnly(date)}`;
        if (test.toDateString() == yesterday.toDateString())
            return `Yesterday ${separator} ${Utilities.printTimeOnly(date)}`;
        else
            return Utilities.printDate(date, separator);
    }

    public static printShortDate(date: Date, separator = "/", dateTimeSeparator = "-") {

        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear();

        if (day.length == 1)
            day = "0" + day;

        if (month.length == 1)
            month = "0" + month;

        return `${month}${separator}${day}${separator}${year} ${dateTimeSeparator} ${Utilities.printTimeOnly(date)}`;
    }


    public static parseDate(date) {

        if (date) {

            if (date instanceof Date) {
                return date;
            }

            if (typeof date === 'string' || date instanceof String) {
                if (date.search(/[a-su-z+]/i) == -1)
                    date = date + "Z";

                return new Date(date);
            }

            if (typeof date === 'number' || date instanceof Number) {
                return new Date(<any>date);
            }
        }
    }



    public static printDuration(start: Date, end: Date) {

        start = new Date(start);
        end = new Date(end);

        // get total seconds between the times
        let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;  // in theory the modulus is not required


        let printedDays = "";

        if (days)
            printedDays = `${days} days`;

        if (hours)
            printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;

        if (minutes)
            printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;

        if (seconds)
            printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;


        if (!printedDays)
            printedDays = "0";

        return printedDays;
    }

    public static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    public static customerCheckInRoom(shopId: number) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + "-" + shopId;
    }

    public static getAge(birthDate, otherDate) {
        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        let years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--;
        }

        return years;
    }




    public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: any[]) {

        if (!searchTerm)
            return true;


        if (!caseSensitive)
            searchTerm = searchTerm.toLowerCase();

        for (let value of values) {

            if (value != null) {
                let strValue = value.toString();

                if (!caseSensitive)
                    strValue = strValue.toLowerCase();

                if (strValue.indexOf(searchTerm) !== -1)
                    return true;
            }
        }

        return false;
    }


    public static expandCamelCase(text: string) {

        if (!text)
            return text;

        return text.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
            return str.toUpperCase();
        })
    }


    public static testIsAbsoluteUrl(url: string) {

        let r = new RegExp('^(?:[a-z]+:)?//', 'i');
        return r.test(url);
    }


    public static convertToAbsoluteUrl(url: string) {

        return Utilities.testIsAbsoluteUrl(url) ? url : '//' + url;
    }



    public static removeNulls(obj) {
        let isArray = obj instanceof Array;

        for (let k in obj) {
            if (obj[k] === null) {
                isArray ? obj.splice(k, 1) : delete obj[k];
            }
            else if (typeof obj[k] == "object") {
                Utilities.removeNulls(obj[k]);
            }

            if (isArray && obj.length == k) {
                Utilities.removeNulls(obj);
            }
        }

        return obj;
    }


    public static debounce(func: (...args) => any, wait: number, immediate?: boolean) {
        var timeout;

        return function () {
            var context = this;
            var args_ = arguments;

            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args_);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow)
                func.apply(context, args_);
        };
    }

    public static cookies = {
        getItem: (sKey) => {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }

            var sExpires = "";

            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }

            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: (sKey, sPath, sDomain) => {
            if (!sKey) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: (sKey) => {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: () => {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    }

    public static withInMonthFilter(date: Date) {
        if(moment(date) > moment(new Date()).subtract(1,'months').subtract(1,'days') && moment(date) < moment(new Date())){
            return true;
        }
        return false;
        
    }

    public static toLocaleDate(date: Date){
      return  moment(date).add('hours',moment().utcOffset()/60).toDate();
    }
}