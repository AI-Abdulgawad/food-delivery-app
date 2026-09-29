

type TimeUnit = 's' | 'm' | 'h'| 'd';

export class TimeUtils {

    static timeConversionUnit:Record<TimeUnit, number> =  {
        s:  1000,
        m:  60 * 1000,
        h:  60 * 60 * 1000,
        d:  24 * 60 * 60 * 1000,
    }

    static toMS(value:number,unit:TimeUnit):number {
        return value * TimeUtils.timeConversionUnit[unit];
    }
}