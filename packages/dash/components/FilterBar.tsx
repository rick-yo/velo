'use client';

import { Card, Flex, Separator } from '@radix-ui/themes';
import SegmentedControl from './SegmentedControl';
import { SearchParamProps } from '@/lib/type';
import { useSetSearchParam } from '@/lib/useSetSearchParam';
import { MetricQueryParam } from '@/db/query';
import { getMetricQueryParam } from '@/lib/getMetricQueryParam';

const deviceOptions: { value: MetricQueryParam['device']; label: string }[] = [
  { label: 'Mobile', value: 'mobile' },
  { label: 'Desktop', value: 'desktop' },
];
const periodOptions: { value: MetricQueryParam['period']; label: string }[] = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 365 Days', value: '365d' },
];

export function FilterBar({ searchParams }: SearchParamProps) {
  const device = getMetricQueryParam(searchParams).device;
  const setSearchParam = useSetSearchParam();

  return (
    <Card variant="ghost">
      <Flex gap="9" align={"center"}>
        <SegmentedControl
          className="w-[200px]"
          value={device}
          options={deviceOptions}
          onValueChange={(value) => setSearchParam('device', value)}
          size="3"
        />
        <SegmentedControl
          value={(searchParams['period'] as string) ?? '24h'}
          options={periodOptions}
          onValueChange={(value) => setSearchParam('period', value)}
          size="3"
        />
      </Flex>
    </Card>
  );
}
