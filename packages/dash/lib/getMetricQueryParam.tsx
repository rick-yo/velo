import { isString } from 'lodash-es';
import { SearchParam } from './type';
import { MetricQueryParam } from '@/db/query';

export function getMetricQueryParam(
  searchParams: SearchParam
): MetricQueryParam {
  const device = isString(searchParams['device'])
    ? (searchParams['device'] as MetricQueryParam['device'])
    : 'mobile';
  const period = isString(searchParams['period'])
    ? (searchParams['period'] as MetricQueryParam['period'])
    : '24h';
  const route = isString(searchParams['route'])
    ? searchParams['route']
    : undefined;
  const metric = isString(searchParams['metric'])
    ? (searchParams['metric'] as MetricQueryParam['metric'])
    : 'LCP';

  return {
    device,
    period,
    route,
    metric,
  };
}
