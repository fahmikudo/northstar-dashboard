import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import type {
  SearchSource,
  SearchableItem,
} from '@astryxdesign/core/Typeahead';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { PROJECT_STATUS_LABELS } from '@/utils/constants';
import { formatShortDate } from '@/utils/formatDate';

interface PaletteItem extends SearchableItem<{
  group: string;
  description?: string;
}> {}

const NAV_ITEMS = [
  { id: 'nav:overview', label: 'Overview', path: '/' },
  { id: 'nav:projects', label: 'Projects', path: '/projects' },
  { id: 'nav:tasks', label: 'Tasks', path: '/tasks' },
  { id: 'nav:team', label: 'Team', path: '/team' },
  { id: 'nav:settings', label: 'Settings', path: '/settings' },
] as const;

export function GlobalSearch() {
  const navigate = useNavigate();
  const tasks = useAppStore(state => state.tasks);
  const projects = useAppStore(state => state.projects);
  const [isOpen, setIsOpen] = useState(false);

  const items = useMemo<PaletteItem[]>(() => {
    const navigation: PaletteItem[] = NAV_ITEMS.map(item => ({
      id: item.id,
      label: item.label,
      auxiliaryData: { group: 'Navigate' },
    }));
    const projectItems: PaletteItem[] = projects.map(project => ({
      id: `project:${project.id}`,
      label: project.name,
      auxiliaryData: {
        group: 'Projects',
        description: `${PROJECT_STATUS_LABELS[project.status]} · due ${formatShortDate(project.dueDate)}`,
      },
    }));
    const taskItems: PaletteItem[] = tasks.map(task => {
      const project = projects.find(
        candidate => candidate.id === task.projectId,
      );
      return {
        id: `task:${task.id}`,
        label: task.title,
        auxiliaryData: {
          group: 'Tasks',
          description: project?.name ?? 'Unknown project',
        },
      };
    });
    return [...navigation, ...projectItems, ...taskItems];
  }, [projects, tasks]);

  const searchSource = useMemo<SearchSource<PaletteItem>>(
    () => ({
      bootstrap: () =>
        items.filter(item => item.auxiliaryData?.group === 'Navigate'),
      search(query) {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
          return items.filter(item => item.auxiliaryData?.group === 'Navigate');
        }
        return items
          .filter(item => {
            const description = item.auxiliaryData?.description ?? '';
            return (
              item.label.toLowerCase().includes(normalized) ||
              description.toLowerCase().includes(normalized)
            );
          })
          .slice(0, 24);
      },
    }),
    [items],
  );

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== 'k'
      ) {
        return;
      }
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        Boolean(target.closest('[contenteditable="true"]'));
      if (isEditing || document.querySelector('dialog[open]')) {
        return;
      }
      event.preventDefault();
      setIsOpen(true);
    }
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  function selectItem(id: string) {
    const navigation = NAV_ITEMS.find(item => item.id === id);
    if (navigation) {
      navigate(navigation.path);
      return;
    }
    if (id.startsWith('project:')) {
      navigate(`/tasks?project=${id.slice('project:'.length)}`);
      return;
    }
    if (id.startsWith('task:')) {
      navigate(`/tasks?task=${id.slice('task:'.length)}`);
    }
  }

  return (
    <>
      <IconButton
        label="Search"
        tooltip="Search"
        icon={<Icon icon={MagnifyingGlassIcon} size="sm" />}
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        searchSource={searchSource}
        label="Search workspace"
        width={560}
        maxHeight={420}
        emptySearchText="No tasks, projects, or pages match."
        renderItem={item => (
          <VStack gap={0}>
            <Text type="body">{item.label}</Text>
            {item.auxiliaryData?.description ? (
              <Text type="supporting" color="secondary">
                {item.auxiliaryData.description}
              </Text>
            ) : null}
          </VStack>
        )}
        onValueChange={value => {
          setIsOpen(false);
          selectItem(value);
        }}
      />
    </>
  );
}
