import { MetricList } from '@/components/MetricList';
import { Container, Flex } from '@radix-ui/themes';
import { MetricItems } from '@/components/MetricItems';
import { SearchParamProps } from '@/lib/type';
import { FilterBar } from '@/components/FilterBar';
import { Chart } from '@/components/Chart';
import { getMetric } from '@/db/query';
import { getMetricQueryParam } from '@/lib/getMetricQueryParam';

export default async function Home({ searchParams }: SearchParamProps) {
  const filter = getMetricQueryParam(searchParams);
  const { intervals } = await getMetric(filter);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <FilterBar searchParams={searchParams} />
        <Flex className="flex-1" direction="row">
          <MetricList>
            <MetricItems searchParams={searchParams} />
          </MetricList>
          <Chart intervals={intervals} searchParams={searchParams} />
        </Flex>
      </Flex>
    </Container>
  );
}
