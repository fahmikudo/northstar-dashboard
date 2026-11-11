import { useMemo } from 'react';
import { Avatar } from '@astryxdesign/core/Avatar';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import {
  Table,
  pixel,
  proportional,
  type TableColumn,
} from '@astryxdesign/core/Table';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import type { TeamMemberStats } from '@/features/team/hooks/useTeam';

export function TeamTable({ members }: { members: TeamMemberStats[] }) {
  const columns = useMemo<TableColumn<TeamMemberStats>[]>(
    () => [
      {
        key: 'name',
        header: 'Member',
        width: proportional(2),
        renderCell: member => (
          <HStack gap={2} vAlign="center">
            <Avatar name={member.name} size="sm" alt="" tooltip={false} />
            <VStack gap={0}>
              <Text type="body">{member.name}</Text>
              <Text type="supporting" color="secondary">
                {member.email}
              </Text>
            </VStack>
          </HStack>
        ),
      },
      { key: 'role', header: 'Role', width: pixel(170) },
      {
        key: 'activeProjects',
        header: 'Projects',
        width: pixel(100),
        renderCell: member => (
          <Text type="supporting">{member.activeProjects}</Text>
        ),
      },
      {
        key: 'openTasks',
        header: 'Open tasks',
        width: pixel(110),
        renderCell: member => <Text type="supporting">{member.openTasks}</Text>,
      },
      {
        key: 'utilization',
        header: 'Weekly load',
        width: pixel(200),
        renderCell: member => (
          <VStack gap={1}>
            <ProgressBar
              value={Math.min(100, member.utilization)}
              label={`${member.name} weekly load`}
              isLabelHidden
              variant={member.utilization > 90 ? 'warning' : 'accent'}
            />
            <Text type="supporting" color="secondary">
              {member.utilization}% of {member.weeklyCapacity}h capacity
            </Text>
          </VStack>
        ),
      },
    ],
    [],
  );

  return (
    <Table<TeamMemberStats>
      data={members}
      columns={columns}
      idKey="id"
      density="compact"
      dividers="rows"
      hasHover
    />
  );
}
