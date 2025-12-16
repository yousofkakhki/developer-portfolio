export function timeConverter(isoTime, locale = 'en') {
  const currentTime = new Date().getTime();
  const pastTime = new Date(isoTime).getTime();
  const timeDifference = currentTime - pastTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const translations = {
    en: {
      seconds: 'seconds ago',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
      months: 'months ago',
      years: 'years ago',
    },
    fa: {
      seconds: 'ثانیه پیش',
      minutes: 'دقیقه پیش',
      hours: 'ساعت پیش',
      days: 'روز پیش',
      months: 'ماه پیش',
      years: 'سال پیش',
    }
  };

  const t = translations[locale] || translations.en;

  if (seconds < 60) {
    return `${seconds} ${t.seconds}`;
  } else if (minutes < 60) {
    return `${minutes} ${t.minutes}`;
  } else if (hours < 24) {
    return `${hours} ${t.hours}`;
  } else if (days < 30) {
    return `${days} ${t.days}`;
  } else if (months < 12) {
    return `${months} ${t.months}`;
  } else {
    return `${years} ${t.years}`;
  }
}
