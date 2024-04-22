import _knex, { Knex } from 'knex';
import { Metric } from 'knex/types/tables';
import { sumBy } from 'lodash-es';

const knex = _knex({
  client: 'sqlite3',
  connection: {
    filename: './velo.sqlite',
  },
});

await up(knex);

export type MetricToInsert = Omit<Metric, 'id' | 'created_at' | 'updated_at'>;

export function insertMetric(metric: MetricToInsert) {
  return knex<Metric>('metrics').insert(metric);
}

export interface MetricQueryParam {
  device: Metric['device'];
  period: '24h' | '7d' | '30d' | '365d';
  metric: Metric['name'];
  route?: string;
}

type MetricInterval = { avg_value: number; created_at: string };
type MetricsResponse = {
  average: number;
  intervals: MetricInterval[];
};

export async function getIntervalMetrics({
  metric,
  device,
  period,
  route,
}: MetricQueryParam): Promise<MetricsResponse> {
  const intervals: MetricInterval[] = await knex<Metric>('metrics')
    .where({
      name: metric,
      route,
      device,
    })
    .andWhere('created_at', '>', createdAt(period))
    .avg('value as avg_value')
    .groupBy(groupByPeriod(period));

  const sum = sumBy(intervals, 'avg_value');
  const average = sum / intervals.length;
  return {
    average,
    intervals,
  };
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('metrics', (table) => {
    table.increments('id').primary();
    table.string('url').notNullable();
    table.string('ip');
    table.string('ua');
    table.string('route');

    table
      .enu('name', ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'])
      .notNullable();
    table
      .enu('device', ['mobile', 'desktop'])
      .notNullable();
    table.float('value').notNullable();
    table.string('metric_id');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

function createdAt(period: MetricQueryParam['period']) {
  const now = new Date().getTime();
  switch (period) {
    case '24h':
      return now - ONE_DAY;
    case '7d':
      return now - ONE_WEEK;
    case '30d':
      return now - ONE_MONTH;
    case '365d':
      return now - ONE_YEAR;
    default:
      return 0;
  }
}

function groupByPeriod(period: MetricQueryParam['period']) {
  if (period === '24h') {
    return knex.raw("strftime('%H', created_at)");
  }
  return knex.raw("strftime('%m-%d', created_at)");
}
