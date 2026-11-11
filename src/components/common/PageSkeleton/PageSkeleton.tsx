import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { VStack } from '@astryxdesign/core/Stack';

/** Shimmer placeholder that mirrors the page header, KPI row, and a panel. */
export function PageSkeleton() {
  return (
    <VStack gap={6} role="status" aria-busy="true" aria-label="Loading page">
      <VStack gap={2}>
        <Skeleton width={180} height={14} index={0} />
        <Skeleton width={320} height={30} index={1} />
        <Skeleton width={460} height={14} index={2} />
      </VStack>
      <Grid columns={{ minWidth: 220, max: 4, repeat: 'fit' }} gap={4}>
        {[0, 1, 2, 3].map(index => (
          <Card key={index}>
            <VStack gap={2}>
              <Skeleton width="45%" height={14} index={index} />
              <Skeleton width="70%" height={28} index={index + 1} />
              <Skeleton width="90%" height={12} index={index + 2} />
            </VStack>
          </Card>
        ))}
      </Grid>
      <Card>
        <VStack gap={3}>
          <Skeleton width="25%" height={18} index={0} />
          {[0, 1, 2].map(index => (
            <Skeleton key={index} height={44} index={index + 1} />
          ))}
        </VStack>
      </Card>
    </VStack>
  );
}
