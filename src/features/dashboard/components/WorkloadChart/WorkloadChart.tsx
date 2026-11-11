import { Card } from '@astryxdesign/core/Card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import type { DashboardWorkload } from '@/features/dashboard/hooks/useDashboardData';

function WorkloadTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <Card padding={3}>
      <Text type="supporting">
        {label}: {payload[0].value} open tasks
      </Text>
    </Card>
  );
}

export function WorkloadChart({ workload }: { workload: DashboardWorkload[] }) {
  return (
    <Card>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>Workload</Heading>
          <Text type="supporting" color="secondary">
            Open tasks per assignee
          </Text>
        </VStack>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={workload}
            layout="vertical"
            margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--app-chart-grid)" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 12, fill: 'var(--app-chart-axis)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 12, fill: 'var(--app-chart-axis)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<WorkloadTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey="openTasks"
              name="Open tasks"
              fill="var(--app-series-1)"
              radius={[0, 4, 4, 0]}
              maxBarSize={16}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </VStack>
    </Card>
  );
}
