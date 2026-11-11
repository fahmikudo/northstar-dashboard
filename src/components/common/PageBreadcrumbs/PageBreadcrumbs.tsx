import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';
import { Icon } from '@astryxdesign/core/Icon';
import { HomeIcon } from '@heroicons/react/24/outline';
import { RouterLink } from '@/routes/RouterLink';

export interface Crumb {
  label: string;
  href?: string;
}

export function PageBreadcrumbs({
  items,
  label = 'Breadcrumb',
}: {
  items: Crumb[];
  label?: string;
}) {
  return (
    <Breadcrumbs variant="supporting" label={label}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return (
          <BreadcrumbItem
            key={`${item.label}-${index}`}
            as={RouterLink}
            href={isCurrent ? undefined : item.href}
            isCurrent={isCurrent}
            startIcon={
              index === 0 ? <Icon icon={HomeIcon} size="xsm" /> : undefined
            }
          >
            {item.label}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
}
