'use strict';
const Units = [
  { id: 'y', name: 'years',   ms: 1000*60*60*24*365 },
  { id: 'M', name: 'months',  ms: 1000*60*60*24*365/12 },
  { id: 'w', name: 'weeks',   ms: 1000*60*60*24*7 },
  { id: 'd', name: 'days',    ms: 1000*60*60*24 },
  { id: 'h', name: 'hours',   ms: 1000*60*60 },
  { id: 'm', name: 'minutes', ms: 1000*60 },
  { id: 's', name: 'seconds', ms: 1000 }
]

class Tic extends Date {
  get year()        { return this.getUTCFullYear() }
  get month()       { return this.getMonth() }
  get day()         { return this.getDay() }
  get date()        { return this.getDate() }
  get hour()        { return this.getHours() }
  get minute()      { return this.getMinutes() }
  get second()      { return this.getSeconds() }
  get millisecond() { return this.getMilliseconds() }

  static diff(a, b=Tic.now) {
    let buf=[], gap=Math.abs(b-a);
    for (let { uv, ms, name } of Units) {
      if (uv = 0|gap/ms) {
        buf.push(`${ uv } ${ uv===1 ? name.slice(0, -1) : name }`)
        gap -= (uv * ms)
      }
    }
    return buf.join(' ')
  }
  static sum(span, time=0) {
      for (let { uv, ms, id, name } of Units) {
        if (uv = span[ id ] || span[ name ])
          time += (uv * ms)
      }
      return time
    }
  static alias(name, ...args) {
      const desc = Object.getOwnPropertyDescriptor(this.prototype, name)
      desc && args.forEach(a => Object.defineProperty(this.prototype, a, desc))
    }
  static get now() {
      return Date.now()
    }
  static get Units() {
      return Units
    }
}

Tic.alias('year'        , 'years'        ,  'y')
Tic.alias('month'       , 'months'       ,  'M')
Tic.alias('day'         , 'days'         ,  'D')
Tic.alias('date'        , 'dates'        ,  'd')
Tic.alias('hour'        , 'hours'        ,  'h')
Tic.alias('minute'      , 'minutes'      ,  'm', 'min')
Tic.alias('second'      , 'seconds'      ,  's', 'sec')
Tic.alias('millisecond' , 'milliseconds' ,  'ms')

module.exports = Tic