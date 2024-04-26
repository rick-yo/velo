'use client';

import { MetricInterval } from '@/db/query';
import { metricNames } from '@/lib/common';
import { getMetricQueryParam } from '@/lib/getMetricQueryParam';
import { SearchParamProps } from '@/lib/type';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function Chart({ intervals, searchParams }: { intervals: MetricInterval[] } & SearchParamProps) {
  const { name } = getMetricQueryParam(searchParams)
  const metricName = metricNames.find(item => item.value === name)?.label

  return (
    <ResponsiveContainer className="flex-1 py-1" height={500}>
      <LineChart
        data={intervals}
        margin={{
          left: 20,
          bottom: 20,
          right: 20,
        }}
      >
        <CartesianGrid strokeDasharray={4} />
        <XAxis dataKey="date" />
        <YAxis dataKey="avg_value" />
        <Tooltip
          formatter={(value, name) => {
            return [value, metricName];
          }}
        />

        <Line
          type="monotone"
          dataKey="avg_value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
