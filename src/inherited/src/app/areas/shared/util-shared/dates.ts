import { Temporal } from '@js-temporal/polyfill';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function daysSince(isoDate: string) {
  const timeZone = Temporal.Now.timeZoneId();

  // openedOn is sometimes a full instant ('...T17:07:52.010Z'), sometimes just a date.
  const opened = DATE_ONLY.test(isoDate)
    ? Temporal.PlainDate.from(isoDate).toZonedDateTime(timeZone)
    : Temporal.Instant.from(isoDate).toZonedDateTimeISO(timeZone);

  const elapsed = opened.until(Temporal.Now.zonedDateTimeISO(timeZone), {
    largestUnit: 'day',
    smallestUnit: 'minute',
  });

  return { days: elapsed.days, hours: elapsed.hours, minutes: elapsed.minutes };
}
