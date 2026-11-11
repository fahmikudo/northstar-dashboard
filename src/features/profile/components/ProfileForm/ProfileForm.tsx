import { useCallback, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useAuth } from '@/hooks/useAuth';
import { isEmail } from '@/utils/validators';

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string } = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Use at least 2 characters.';
    }
    if (!isEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    setIsSaved(true);
  };

  const clearError = useCallback((field: 'name' | 'email') => {
    setErrors(current => ({ ...current, [field]: undefined }));
  }, []);

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          <VStack gap={1}>
            <Heading level={2}>Profile</Heading>
            <Text type="supporting" color="secondary">
              Shown on tasks, projects, and activity you create.
            </Text>
          </VStack>
          <FormLayout>
            <TextInput
              label="Full name"
              value={name}
              onChange={value => {
                setName(value);
                clearError('name');
                setIsSaved(false);
              }}
              status={
                errors.name
                  ? { type: 'error', message: errors.name }
                  : undefined
              }
            />
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={value => {
                setEmail(value);
                clearError('email');
                setIsSaved(false);
              }}
              status={
                errors.email
                  ? { type: 'error', message: errors.email }
                  : undefined
              }
            />
          </FormLayout>
          <HStack gap={3} vAlign="center">
            <Button type="submit" label="Save changes" variant="primary" />
            {isSaved ? (
              <Text type="supporting" color="secondary">
                Saved just now
              </Text>
            ) : null}
          </HStack>
        </VStack>
      </form>
    </Card>
  );
}
