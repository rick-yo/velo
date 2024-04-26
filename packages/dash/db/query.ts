import { Duration, msToSeconds, unixTimestamp } from '@/lib/common';
import _knex, { Knex } from 'knex';
import { Metric } from 'knex/types/tables';
import { sumBy, toNumber } from 'lodash-es';

export const knex = _knex({
  client: 'sqlite3',
  connection: {
    filename: './velo.sqlite',
  },
});

await up(knex);

export type MetricToInsert = Omit<Metric, 'id' | 'created_at'> &
  Partial<Pick<Metric, 'created_at'>>;

export function insertMetric(metric: MetricToInsert) {
  return knex<Metric>('metrics').insert(metric);
}

export interface MetricQueryParam {
  device: Metric['device'];
  period: '24h' | '7d' | '30d' | '365d';
  name: Metric['name'];
  route?: string;
}

export type MetricInterval = { avg_value: number; date: string };
type MetricsResponse = {
  average: number;
  intervals: MetricInterval[];
};

export const getMetric = async ({
  name,
  device,
  period,
  route,
}: MetricQueryParam): Promise<MetricsResponse> => {
  const intervals: MetricInterval[] = await knex<Metric>('metrics')
    .select(groupByPeriod(period))
    .avg('value as avg_value')
    .where({
      name,
      device,
    })
    .andWhere('created_at', '>', createdAt(period))
    .modify((query) => {
      if (route) {
        query.where({ route });
      }
    })
    .groupBy('date');

  const sum = sumBy(intervals, 'avg_value');
  const average = sum ? msToSeconds((sum / intervals.length)) : 0;
  return {
    average,
    intervals: intervals.map((item) => ({
      ...item,
      avg_value: msToSeconds(item.avg_value),
    })),
  };
};

export async function up(knex: Knex): Promise<void> {
  try {
    const exists = await knex.schema.hasTable('metrics');
    if (exists) return;
    await knex.schema.createTable('metrics', (table) => {
      table.increments('id').primary();
      table.string('url').notNullable();
      table.string('ip');
      table.string('ua');
      table.string('route');

      table
        .enu('name', ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'])
        .notNullable();
      table.enu('device', ['mobile', 'desktop']).notNullable();
      table.float('value').notNullable();
      table.string('metric_id');

      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
    console.info('Table initialized successfully.');
  } catch (error) {
    console.warn(error);
  }
}

function createdAt(period: MetricQueryParam['period']) {
  const now = unixTimestamp();
  switch (period) {
    case '24h':
      return now - Duration.day;
    case '7d':
      return now - Duration.week;
    case '30d':
      return now - Duration.month;
    case '365d':
      return now - Duration.year;
    default:
      return 0;
  }
}

function groupByPeriod(period: MetricQueryParam['period']) {
  if (period === '24h') {
    return knex.raw("STRFTIME('%H%P', created_at, 'unixepoch') AS date");
  }
  return knex.raw("STRFTIME('%m-%d', created_at, 'unixepoch') AS date");
}
