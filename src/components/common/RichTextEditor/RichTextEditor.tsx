import { useEffect, useRef, useState } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { Icon } from '@astryxdesign/core/Icon';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { marked } from 'marked';
import TurndownService from 'turndown';
import {
  BoldIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
  H2Icon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
} from '@heroicons/react/24/outline';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export function RichTextEditor({
  value,
  onChange,
  label = 'Description',
  onSubmit,
}: {
  value: string;
  onChange: (markdown: string) => void;
  label?: string;
  onSubmit?: () => void;
}) {
  const [initialHtml] = useState(() => markdownToHtml(value));
  const submitRef = useRef(onSubmit);

  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Placeholder.configure({
        placeholder:
          'Describe the task, add acceptance criteria, or paste links…',
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        'aria-label': label,
        role: 'textbox',
        'aria-multiline': 'true',
      },
      handleKeyDown: (_view, event) => {
        if (
          submitRef.current &&
          (event.metaKey || event.ctrlKey) &&
          event.key === 'Enter'
        ) {
          event.preventDefault();
          submitRef.current();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(turndown.turndown(instance.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }
    editor.commands.setContent(initialHtml, { emitUpdate: false });
  }, [editor, initialHtml]);

  if (!editor) {
    return null;
  }

  const formattingActions = [
    {
      label: 'Bold',
      icon: BoldIcon,
      isActive: editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: ItalicIcon,
      isActive: editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Heading',
      icon: H2Icon,
      isActive: editor.isActive('heading', { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Bullet list',
      icon: ListBulletIcon,
      isActive: editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered list',
      icon: NumberedListIcon,
      isActive: editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Quote',
      icon: ChatBubbleBottomCenterTextIcon,
      isActive: editor.isActive('blockquote'),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: 'Code',
      icon: CodeBracketIcon,
      isActive: editor.isActive('codeBlock'),
      run: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <VStack gap={2}>
      <HStack gap={1} wrap="wrap">
        {formattingActions.map(action => (
          <ToggleButton
            key={action.label}
            label={action.label}
            size="sm"
            isIconOnly
            icon={<Icon icon={action.icon} size="sm" />}
            isPressed={action.isActive}
            onPressedChange={action.run}
          />
        ))}
      </HStack>
      <Card padding={3} className="app-rich-text">
        <EditorContent editor={editor} />
      </Card>
    </VStack>
  );
}
