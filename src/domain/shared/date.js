export const DEFAULT_CREATED_AT = '2026-05-06T00:00:00.000Z';

export function toIsoDateTime(value, fallbackHour = '09:00:00') {
  if (!value) return DEFAULT_CREATED_AT;
  if (String(value).includes('T')) return new Date(value).toISOString();

  return new Date(`${value}T${fallbackHour}`).toISOString();
}

export function addHours(isoDate, hours) {
  const date = new Date(isoDate);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export function inPeriod(isoDate, periodStart, periodEnd) {
  const value = new Date(isoDate).getTime();
  return value >= new Date(periodStart).getTime() && value <= new Date(periodEnd).getTime();
}
