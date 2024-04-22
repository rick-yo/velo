'use client';

import { useSetSearchParam } from '@/lib/useSetSearchParam';
import { Flex, RadioCards } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export function MetricList({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const metric = searchParams.get('metric') ?? 'LCP';
  const setSearchParam = useSetSearchParam();

  return (
    <Flex>
      <RadioCards.Root
        value={metric}
        columns="1"
        gap="2"
        onValueChange={(metric) => setSearchParam('metric', metric)}
      >
        {children}
      </RadioCards.Root>
    </Flex>
  );
}
