import Moment from 'moment-timezone';
import timezone from 'countries-and-timezones';
import Config from './config';
import Utils from './utils';

export default class Time {

    _moment: Moment.Moment;

    static instance(item?: any, format?: string, correctTimezone?: boolean) {
        return new Time(item, format, correctTimezone);
    }

    constructor(item?: any, format?: string, correctTimezone?: boolean) {

        if (item instanceof Time) {
            this._moment = item._moment;
            return;
        }

        const userLang = Config.languageConfig().default
        Moment.locale(userLang);

        let it = item;
        if (!it) {
            const now = new Date();
            const date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+ now.getDate();
            const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            it = date+' '+time;
        }

        let f = format;
        if (!f) {
            if (it.includes('Z')) {
                f = "YYYY-MM-DDTHH:mm:ssZ";
            } else if (it.includes(':')) {
                f = 'YYYY-MM-DD HH:mm:ss';
            } else {
                f = 'YYYY-MM-DD';
            }
        }

        this._moment = Moment(it, f == 'unix' ? undefined : f);
        if (correctTimezone) {
            const tz = timezone.getTimezone(Moment.tz.guess());
            if (tz) {
                this._moment = this._moment.add(tz.dstOffset / 60, 'hours');
            }
        }

    }

    utc() {
        return this.format('YYYY-MM-DDTHH:mm:ssZ');
    }
    
    gmt() {
        const displace = this._moment.utcOffset();
        const t = this.copy().add(-displace, 'minutes');
        let str = t.format('YYYY-MM-DDTHH:mm:ss');
        str += 'Z';
        return str;
    }

    toDate() {
        return this._moment.toDate();
    }

    format(format: string) {
        return this._moment.format(format);
    }

    dateString() {
        return this._moment.format("dddd DD MMM - HH:mm");
    }

    date() {
        return this._moment.format("DD/MM/YYYY");
    }

    millis() {
        return this._moment.valueOf();
    }

    timestamp() {
        return parseInt(this._moment.format("X"));
    }

    datetime(separator:string = ' ') {
        return this._moment.format("YYYY-MM-DD"+ separator +"HH:mm:ss");
    }

    time() {
        return this._moment.format("HH:mm");
    }

    dateAndTime() {
        return this._moment.format("DD/MM/YYYY HH:mm");
    }

    calendar() {
        return this._moment.format("ddd D MMMM YYYY");
    }

    ago() {
        return Moment.duration( Moment(new Date()).diff(this._moment) ).asSeconds()
    }

    agoText() {
        return this._moment.fromNow();
    }

    get daysThisMonth() : number {
        return Number(this._moment.daysInMonth());
    }

    set(what: 'year'|'month'|'day'|'hour'|'minute'|'second', value: number): Time {
        let format = 'YYYY-MM-DD HH:mm:ss'
        let v = value + ''
        if (v.length < 2) {
          v = '0' + v
        }
        if (what == 'year') format = format.replace('YYYY', v)
        if (what == 'month') format = format.replace('MM', v)
        if (what == 'day') format = format.replace('DD', v)
        if (what == 'hour') format = format.replace('HH', v)
        if (what == 'minute') format = format.replace('mm', v)
        if (what == 'second') format = format.replace('ss', v)
        this._moment = Moment(this.format(format), 'YYYY-MM-DD HH:mm:ss');
        return this;
    }

    get(what: 'year'|'month'|'day'|'hour'|'minute'|'second', asString: boolean = false) : Number | string {
        let f = "YYYY";
        if (what == "second") f = "ss";
        else if (what == "minute") f = "mm";
        else if (what == "hour") f = "HH";
        else if (what == "day") f = "DD";
        else if (what == "month") f = "MM";
        let val: any = Number(this._moment.format(f));
        if (asString) val += "";
        return val;
    }

    static timeToDate(value: string) {
        const d : any = new Date();
        const parts = value.split(":");
        d.setHours = parseInt(parts[0]);
        d.setMinutes = parseInt(parts[1]);
        return d;
    }

    add(amount: number, unit: 
        'second'|'seconds'|
        'minute'|'minutes'|
        'hour'|'hours'|
        'day'|'days'|
        'month'|'months' = 'days') : Time {

        let u : string = unit;
        if (u[u.length - 1] != 's') {
            u += 's';
        }

        this._moment.add(amount, u as any);
        return this;
    }

    sub(amount: number, unit: 
        'second'|'seconds'|
        'minute'|'minutes'|
        'hour'|'hours'|
        'day'|'days'|
        'month'|'months' = 'days') : Time {
        return this.add(-amount, unit);
    }

    dayOfWeek(sundayFirst: boolean = false) : number {
        let d = this.toDate().getDay();
        if (!sundayFirst) d -= 1;
        if (d < 0) d = 6;
        return d;
    }

    get dayOfMonth() : number {
        return this.toDate().getDate();
    }

    get dayName() : string {
        return Utils.capitalize(this.format('dddd'));
    }

    getMonday() : Time {
        let d : Date = this._moment.toDate();
        const day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        d = new Date(d.setDate(diff));

        const str = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return new Time(str);
    }

    getSunday() : Time {
        let d : Date = this._moment.toDate();
        const day = d.getDay(),
            diff = d.getDate() + (6 - day) + (day == 0 ? -6:1); // adjust when day is sunday
        d = new Date(d.setDate(diff));

        const str = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return new Time(str);
    }

    getFirstOfMonth() : Time {
        return Time.instance(this.format('YYYY-MM-01 HH:mm:ss'));
    }

    getLastOfMonth() : Time {
        return Time.instance(this.format('YYYY-MM-' + this.daysThisMonth + ' HH:mm:ss'));
    }

    static now() : Time {
        return new Time();
    }

    static todayAt(hour: number, minute?: number) : Time {
        const d = new Date();
        d.setHours(hour, minute);
        return Time.fromDate(d);
    }

    static fromDate(d: Date) {

        ///// FORMAT DATE AS STRING

        let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        const hour = d.getHours();
        const minute = d.getMinutes();
        const second = d.getSeconds();

        const str = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        //////////
        return new Time(str, "YYYY-MM-DD HH:mm:ss");
    }

    static fromTimestamp(t: number) {
        return new Time(t, "X");
    }

    copy() {
        return new Time(this.datetime());
    }

    isAfter(other: Time) {
        return this._moment.isAfter(other._moment);
    }

    isBefore(other: Time) {
        return this._moment.isBefore(other._moment)
    }

    isPast() {
        return !this.isAfter(Time.now());
    }

    isFuture() {
        return !this.isPast();
    }

    diff(t2: Time|string) : TimeInterval {
        const t : Time = typeof(t2) == 'string' ? new Time(t2) : t2;
        return new TimeInterval(this, t);
    }
}

export class TimeInterval {

    t1: Time;
    t2: Time;

    constructor(t1: Time, t2: Time) {
        this.t1 = t1;
        this.t2 = t2;
    }

    static instance(t1: Time, t2: Time) {
        return new TimeInterval(t1, t2);
    }

    get seconds() {
        return this.t1._moment.diff(this.t2._moment, 'seconds');
    }

    get minutes() {
        return this.t1._moment.diff(this.t2._moment, 'minutes');
    }

    get hours() {
        return this.t1._moment.diff(this.t2._moment, 'hours');
    }

    get days() {
        return this.t1._moment.diff(this.t2._moment, 'days');
    }

    get months() {
        return this.t1._moment.diff(this.t2._moment, 'months');
    }

    get years() {
        return this.t1._moment.diff(this.t2._moment, 'years');
    }

    get elapsed() {

        const y = this.years;
        const m = this.months - (y*12);
        const d = this.days - (m * 30);
        const h = this.hours - Math.floor(d * 24);
        const min = this.minutes - Math.floor(h * 60);
        const s = this.seconds - Math.floor(min * 60);

        return {
            years: y,
            months: m,
            days: d,
            hours: h,
            minutes: min,
            seconds: s
        }
    }

}