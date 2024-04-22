import { insertMetric } from '@/db/query';
import { Metric } from 'knex/types/tables';
import { toNumber } from 'lodash-es';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const ip = getIP();
  const ua = headers().get('user-agent');
  const url = new URL(request.url);
  const { searchParams } = url;
  const route = searchParams.get('route');
  const name = searchParams.get('name');
  const value = toNumber(searchParams.get('value'));
  const metric_id = searchParams.get('metric_id');

  if (!ua)
    return new Response(null, {
      status: 400,
    });

  const metic: Omit<Metric, 'id' | 'created_at' | 'updated_at'> = {
    ip,
    ua,
    url: url.toString(),
    route,
    name: name as Metric['name'],
    value,
    metric_id,
    device: isMobile(ua) ? 'mobile' : 'desktop',
  };
  await insertMetric(metic);

  return new Response(null, {
    status: 204,
  });
}

function getIP() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0';
  const forwardedFor = headers().get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
}

function isMobile(ua: string) {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(ua);
}
