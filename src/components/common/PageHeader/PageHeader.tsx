import type { ReactNode } from 'react';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  return (
    <HStack hAlign="between" vAlign="end" gap={4} wrap="wrap">
      <VStack gap={1}>
        {breadcrumbs}
        <Heading level={1}>{title}</Heading>
        {description ? (
          <Text type="body" color="secondary">
            {description}
          </Text>
        ) : null}
      </VStack>
      {actions ? (
        <HStack gap={2} vAlign="end">
          {actions}
        </HStack>
      ) : null}
    </HStack>
  );
}
