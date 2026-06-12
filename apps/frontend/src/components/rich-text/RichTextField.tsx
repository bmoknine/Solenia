import { useEffect, type CSSProperties } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { normalizeRichTextOutput, prepareEditorContent } from './richTextUtils';
import './RichTextField.css';

type RichTextFieldProps = {
  value: string | null | undefined;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolbarButtonProps = {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, title, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rich-text-toolbar-btn${active ? ' active' : ''}`}
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function RichTextField({
  value,
  onChange,
  placeholder = 'Saisir du texte…',
  minHeight = 160,
}: RichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: prepareEditorContent(value),
    editorProps: {
      attributes: {
        class: 'rich-text-editor-body',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(normalizeRichTextOutput(ed.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = normalizeRichTextOutput(editor.getHTML());
    const next = normalizeRichTextOutput(prepareEditorContent(value));
    if (current !== next) {
      editor.commands.setContent(prepareEditorContent(value), { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className="rich-text-field"
      style={{ '--rich-text-min-height': `${minHeight}px` } as CSSProperties}
    >
      <div className="rich-text-toolbar" role="toolbar" aria-label="Mise en forme">
        <ToolbarButton
          label="B"
          title="Gras"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          title="Italique"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="S"
          title="Barré"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <span className="rich-text-toolbar-sep" aria-hidden="true" />
        <ToolbarButton
          label="H2"
          title="Titre niveau 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          title="Titre niveau 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <span className="rich-text-toolbar-sep" aria-hidden="true" />
        <ToolbarButton
          label="•"
          title="Liste à puces"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1."
          title="Liste numérotée"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="❝"
          title="Citation"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
      </div>
      <EditorContent editor={editor} className="rich-text-editor" />
    </div>
  );
}
