export function timeConverter(isoTime, locale = 'en') {
  const timestamp = new Date(isoTime).getTime();
  if (!Number.isFinite(timestamp)) return '';

  const elapsedSeconds = (timestamp - Date.now()) / 1000;
  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];
  const [unit, divisor] = units.find(([, seconds]) => Math.abs(elapsedSeconds) >= seconds) || units.at(-1);
  const value = Math.round(elapsedSeconds / divisor);
  const formatter = new Intl.RelativeTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    numeric: 'always',
  });

  return formatter.format(value, unit);
}
