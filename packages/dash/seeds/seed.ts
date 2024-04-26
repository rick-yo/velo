import { MetricToInsert, knex } from '@/db/query';
import { unixTimestamp } from '@/lib/common';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash-es';

function seed() {
  // Inserts seed entries
  const entries: MetricToInsert[] = [];

  // Create 10 random entries with different values
  for (let i = 1; i <= 500; i++) {
    const ua = faker.internet.userAgent();
    const ip = faker.internet.ip();
    const metric: MetricToInsert = {
      url: faker.internet.url(),
      ip: ip,
      ua: ua,
      device: Math.random() > 0.5 ? 'mobile' : 'desktop',
      route: new URL(faker.internet.url()).pathname,
      name: sample(['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB']),
      value: Math.random() * 5000,
      metric_id: null,
      created_at: unixTimestamp(faker.date.recent({ days: 30 }).getTime()),
    };
    entries.push(metric);
  }

  // Add the entries to the database all at once
  return knex('metrics').insert(entries);
}

await seed();
process.exit();
