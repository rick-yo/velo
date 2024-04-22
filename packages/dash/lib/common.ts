import { Metric } from "knex/types/tables";

export function unixTimestamp(ms = new Date().getTime()) {
  return Math.floor(ms / 1000);
}

const day = 24 * 60 * 60;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

export const Duration = {
  day,
  week,
  month,
  year,
};

export const metricNames: { value: Metric['name']; label: string }[] = [
  { label: 'Largest Contentful Paint', value: 'LCP' },
  { label: 'First Input Delay', value: 'FID' },
  { label: 'Cumulative Layout Shift', value: 'CLS' },
  { label: 'Time to First Byte', value: 'TTFB' },
  { label: 'First Contentful Paint', value: 'FCP' },
  { label: 'Interaction to Next Paint', value: 'INP' },
];
