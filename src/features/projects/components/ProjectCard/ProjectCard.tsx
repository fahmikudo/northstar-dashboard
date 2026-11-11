import { Card } from '@astryxdesign/core/Card';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import type { ProjectWithStats } from '@/types/project.types';
import { formatDueDate } from '@/utils/formatDate';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Link } from '@astryxdesign/core/Link';
import { RouterLink } from '@/routes/RouterLink';
import { userService } from '@/services/userService';

export function ProjectCard({
  project,
  onComplete,
}: {
  project: ProjectWithStats;
  onComplete: (id: string) => void;
}) {
  const owner = userService.find(project.ownerId);
  const members = project.memberIds
    .map(id => userService.find(id))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));

  return (
    <Card>
      <VStack gap={3}>
        <HStack hAlign="between" vAlign="start" gap={3}>
          <Heading level={3}>{project.name}</Heading>
          <StatusBadge status={project.status} />
        </HStack>
        <Text type="supporting" color="secondary">
          {project.description}
        </Text>
        <VStack gap={1}>
          <ProgressBar
            value={project.progress}
            label={`${project.name} progress`}
            isLabelHidden
            hasValueLabel
          />
          <Text type="supporting" color="secondary">
            {project.tasksDone} of {project.tasksTotal} tasks complete
          </Text>
        </VStack>
        <HStack hAlign="between" vAlign="center">
          <HStack gap={2} vAlign="center">
            <Avatar
              name={owner?.name ?? 'Unassigned'}
              size="sm"
              alt=""
              tooltip={false}
            />
            <VStack gap={0}>
              <Text type="supporting">{owner?.name ?? 'Unassigned'}</Text>
              <Text
                type="supporting"
                color={project.isOverdue ? 'accent' : 'secondary'}
              >
                {project.isOverdue
                  ? `Overdue · ${formatDueDate(project.dueDate)}`
                  : `Due ${formatDueDate(project.dueDate).toLowerCase()}`}
              </Text>
            </VStack>
          </HStack>
          <HStack gap={1}>
            {members.slice(0, 3).map(member => (
              <Avatar key={member.id} name={member.name} size="xsm" />
            ))}
          </HStack>
        </HStack>
        <HStack hAlign="between" vAlign="center">
          <Link as={RouterLink} href={`/tasks?project=${project.id}`}>
            View tasks
          </Link>
          {project.status === 'completed' ? null : (
            <Button
              label="Mark complete"
              variant="ghost"
              size="sm"
              onClick={() => onComplete(project.id)}
            />
          )}
        </HStack>
      </VStack>
    </Card>
  );
}
