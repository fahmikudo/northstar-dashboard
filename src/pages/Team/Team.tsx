import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Stack';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { PageHeader } from '@/components/common/PageHeader';
import { TeamTable } from '@/features/team/components/TeamTable';
import { useTeam } from '@/features/team/hooks/useTeam';

export function Team() {
  const members = useTeam();

  return (
    <VStack gap={6}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[{ label: 'Workspace', href: '/' }, { label: 'Team' }]}
          />
        }
        title="Team"
        description="Who is carrying the work this week, and how much is already committed."
      />
      <Card>
        <TeamTable members={members} />
      </Card>
    </VStack>
  );
}
