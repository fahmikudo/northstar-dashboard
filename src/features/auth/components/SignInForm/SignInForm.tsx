import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { HStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { appConfig } from '@/config/appConfig';
import { useAuth } from '@/hooks/useAuth';
import type { FieldErrors } from '@/types/api.types';
import { hasErrors, validateSignIn } from '@/utils/validators';

export function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>(appConfig.demoEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    FieldErrors<{ email: string; password: string }>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextErrors = validateSignIn(email, password);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setFormError(null);
      return;
    }
    try {
      signIn(email, password);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign in.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormLayout>
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={value => {
            setEmail(value);
            setErrors(current => ({ ...current, email: undefined }));
          }}
          status={
            errors.email ? { type: 'error', message: errors.email } : undefined
          }
        />
        <TextInput
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={value => {
            setPassword(value);
            setErrors(current => ({ ...current, password: undefined }));
          }}
          status={
            errors.password
              ? { type: 'error', message: errors.password }
              : undefined
          }
        />
        {formError ? (
          <Text type="supporting" color="accent">
            {formError}
          </Text>
        ) : null}
        <HStack gap={2} hAlign="end">
          <Button
            label="Fill demo credentials"
            variant="secondary"
            onClick={() => {
              setEmail(appConfig.demoEmail);
              setPassword(appConfig.demoPassword);
              setErrors({});
            }}
          />
          <Button label="Sign in" variant="primary" type="submit" />
        </HStack>
      </FormLayout>
    </form>
  );
}
