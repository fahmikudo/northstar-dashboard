import { VStack } from '@astryxdesign/core/Stack';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { PageHeader } from '@/components/common/PageHeader';
import { PreferencesForm } from '@/features/profile/components/PreferencesForm';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export function Settings() {
  return (
    <VStack gap={6}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[{ label: 'Workspace', href: '/' }, { label: 'Settings' }]}
          />
        }
        title="Settings"
        description="Your profile, appearance, and the notifications this workspace sends."
      />
      <VStack gap={4} maxWidth={720}>
        <ProfileForm />
        <PreferencesForm />
      </VStack>
    </VStack>
  );
}
