import { Temporal } from '@js-temporal/polyfill';

export function daysSince(isoDate: string) {
  const sp = Temporal.Now.plainDateISO().since(Temporal.PlainDateTime.from(isoDate));
  // console.log({ days: sp.days, hours: sp.hours, mins: sp.minutes });
  return sp;
}
