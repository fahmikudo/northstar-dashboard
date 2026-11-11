import type { ReactNode } from 'react';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

export function Modal({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  width = 560,
  footer,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  subtitle?: string;
  width?: number;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      width={width}
      purpose="form"
      padding={5}
    >
      <Layout
        height="fill"
        header={
          <DialogHeader
            title={title}
            subtitle={subtitle}
            onOpenChange={onOpenChange}
          />
        }
        content={<LayoutContent>{children}</LayoutContent>}
        footer={footer ? <LayoutFooter>{footer}</LayoutFooter> : undefined}
      />
    </Dialog>
  );
}
