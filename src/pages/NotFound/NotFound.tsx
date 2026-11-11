import { Button } from '@astryxdesign/core/Button';
import { Center } from '@astryxdesign/core/Center';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { useAuth } from '@/hooks/useAuth';
import { RouterLink } from '@/routes/RouterLink';

export function NotFound() {
  const { user } = useAuth();

  return (
    <Center height="100%" padding={6}>
      <VStack gap={3} hAlign="center" maxWidth={420}>
        <Text type="display-3" hasTabularNumbers>
          404
        </Text>
        <Heading level={1}>This page moved off the board</Heading>
        <Text type="body" color="secondary" justify="center">
          The page you followed does not exist, or the project it belonged to
          was renamed.
        </Text>
        <Button
          as={RouterLink}
          href={user ? '/' : '/login'}
          label={user ? 'Back to overview' : 'Go to sign in'}
          variant="primary"
        />
      </VStack>
    </Center>
  );
}
