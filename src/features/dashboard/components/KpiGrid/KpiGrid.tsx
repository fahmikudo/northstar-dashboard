import { Grid } from '@astryxdesign/core/Grid';
import { Icon } from '@astryxdesign/core/Icon';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { MetricCard } from '@/components/common/MetricCard';
import type { DashboardKpis } from '@/features/dashboard/hooks/useDashboardData';

export function KpiGrid({ kpis }: { kpis: DashboardKpis }) {
  return (
    <Grid columns={{ minWidth: 220, max: 4, repeat: 'fit' }} gap={4}>
      <MetricCard
        label="Active projects"
        value={String(kpis.activeProjects)}
        caption="Planning, active, and at risk"
        icon={<Icon icon={FolderIcon} size="sm" color="secondary" />}
      />
      <MetricCard
        label="Open tasks"
        value={String(kpis.openTasks)}
        caption="Across every project"
        icon={<Icon icon={CheckCircleIcon} size="sm" color="secondary" />}
      />
      <MetricCard
        label="Due this week"
        value={String(kpis.dueSoon)}
        caption="Within the next 7 days"
        icon={<Icon icon={ClockIcon} size="sm" color="secondary" />}
      />
      <MetricCard
        label="Completion rate"
        value={`${kpis.completionRate}%`}
        caption="Tasks completed to date"
        icon={<Icon icon={ChartBarIcon} size="sm" color="secondary" />}
      />
    </Grid>
  );
}
