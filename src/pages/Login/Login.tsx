import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Divider } from '@astryxdesign/core/Divider';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoUrl from '@/assets/icons/logo.svg';
import { appConfig } from '@/config/appConfig';
import { useAuth } from '@/hooks/useAuth';
import { SignInForm } from '@/features/auth';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo, user]);

  if (user) {
    return null;
  }

  return (
    <Center height="100%" padding={6}>
      <VStack gap={5} width="100%" maxWidth={420}>
        <VStack gap={2} hAlign="center">
          <img src={logoUrl} alt="" width={40} height={40} />
          <Heading level={1}>{appConfig.name}</Heading>
          <Text type="body" color="secondary" justify="center">
            {appConfig.description}
          </Text>
        </VStack>
        <Card>
          <VStack gap={4}>
            <Heading level={2}>Sign in</Heading>
            <SignInForm />
            <Divider />
            <Text type="supporting" color="secondary">
              Demo workspace: {appConfig.demoEmail} / {appConfig.demoPassword}.
              Any password with 6+ characters is accepted.
            </Text>
          </VStack>
        </Card>
      </VStack>
    </Center>
  );
}
