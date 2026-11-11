import type { ReactNode } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';

export function MetricCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <VStack gap={2}>
        <HStack hAlign="between" vAlign="center">
          <Heading level={3}>{label}</Heading>
          {icon}
        </HStack>
        <Text type="display-3" hasTabularNumbers>
          {value}
        </Text>
        <Text type="supporting" color="secondary">
          {caption}
        </Text>
      </VStack>
    </Card>
  );
}
