declare module 'knex/types/tables' {
  interface Metric {
    id: number;
    url: string;
    ip: string | null;
    ua: string;
    device: 'mobile' | 'desktop';
    route: string | null;

    name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
    value: number;
    metric_id: string | null;

    created_at: number;
  }

  interface Tables {
    metrics: Metric;
  }
}
