import { Card } from '@astryxdesign/core/Card';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import {
  Table,
  pixel,
  proportional,
  type TableColumn,
} from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { ProjectWithStats } from '@/types/project.types';
import { formatShortDate } from '@/utils/formatDate';
import { RouterLink } from '@/routes/RouterLink';

const columns: TableColumn<ProjectWithStats>[] = [
  {
    key: 'name',
    header: 'Project',
    width: proportional(2),
    renderCell: project => <Text type="body">{project.name}</Text>,
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(110),
    renderCell: project => <StatusBadge status={project.status} />,
  },
  {
    key: 'tasks',
    header: 'Tasks',
    width: pixel(90),
    renderCell: project => (
      <Text type="supporting">
        {project.tasksDone}/{project.tasksTotal}
      </Text>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due',
    width: pixel(100),
    renderCell: project => (
      <Text type="supporting" color="secondary">
        {formatShortDate(project.dueDate)}
      </Text>
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    width: pixel(160),
    renderCell: project => (
      <VStack gap={1}>
        <ProgressBar
          value={project.progress}
          label={`${project.name} progress`}
          isLabelHidden
        />
        <Text type="supporting" color="secondary">
          {project.progress}%
        </Text>
      </VStack>
    ),
  },
];

export function PortfolioPanel({ projects }: { projects: ProjectWithStats[] }) {
  return (
    <Card>
      <VStack gap={4}>
        <HStack hAlign="between" vAlign="center">
          <Heading level={2}>Portfolio</Heading>
          <Link as={RouterLink} href="/projects">
            All projects
          </Link>
        </HStack>
        <Table<ProjectWithStats>
          data={projects}
          columns={columns}
          idKey="id"
          density="compact"
          dividers="rows"
          hasHover
        />
      </VStack>
    </Card>
  );
}
