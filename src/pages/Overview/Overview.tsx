import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { PageHeader } from '@/components/common/PageHeader';
import {
  ActivityFeed,
  KpiGrid,
  PortfolioPanel,
  WorkloadChart,
  useDashboardData,
} from '@/features/dashboard';

export function Overview() {
  const { kpis, workload, activity, portfolio } = useDashboardData();

  return (
    <VStack gap={6}>
      <PageHeader
        title="Overview"
        description="Delivery health across active projects and the team's week."
      />
      <VStack gap={4}>
        <Heading level={2}>Key metrics</Heading>
        <KpiGrid kpis={kpis} />
      </VStack>
      <PortfolioPanel projects={portfolio} />
      <Grid columns={{ minWidth: 320, max: 2, repeat: 'fit' }} gap={4}>
        <WorkloadChart workload={workload} />
        <ActivityFeed activity={activity} />
      </Grid>
    </VStack>
  );
}
