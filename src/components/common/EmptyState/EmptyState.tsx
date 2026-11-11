import type { ReactNode } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { EmptyState as AstryxEmptyState } from '@astryxdesign/core/EmptyState';
import emptyStateArt from '@/assets/images/empty-state.svg';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <AstryxEmptyState
        title={title}
        description={description}
        icon={<img src={emptyStateArt} alt="" width={160} height={120} />}
        actions={action}
      />
    </Card>
  );
}
