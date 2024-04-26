import { getMetric } from '@/db/query';
import { getMetricQueryParam } from '@/lib/getMetricQueryParam';
import { SearchParamProps } from '@/lib/type';
import { metricNames } from '@/lib/common';
import { Flex, Heading, RadioCards } from '@radix-ui/themes';
import { Metric } from 'knex/types/tables';

export function MetricItems({ searchParams }: SearchParamProps) {
  return (
    <>
      {metricNames.map((option) => (
        <RadioCards.Item key={option.value} value={option.value}>
          <Flex direction="column" width="100%" gap="2">
            <Heading size="2">{option.label}</Heading>
            <MetricValue name={option.value} searchParams={searchParams} />
          </Flex>
        </RadioCards.Item>
      ))}
    </>
  );
}

async function MetricValue({
  name,
  searchParams,
}: { name: Metric['name'] } & SearchParamProps) {
  const { device, period } = getMetricQueryParam(searchParams);
  const { average } = await getMetric({ name, device, period });

  return <Heading size="4">{average}</Heading>;
}
