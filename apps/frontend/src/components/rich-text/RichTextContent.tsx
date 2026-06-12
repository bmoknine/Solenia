import DOMPurify from 'dompurify';
import { looksLikeHtml } from './richTextUtils';
import './RichTextField.css';

type RichTextContentProps = {
  value: string | null | undefined;
  className?: string;
  emptyLabel?: string;
};

export function RichTextContent({
  value,
  className = 'detail-desc',
  emptyLabel = '—',
}: RichTextContentProps) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return <p className={className}>{emptyLabel}</p>;
  }

  if (looksLikeHtml(trimmed)) {
    return (
      <div
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trimmed) }}
      />
    );
  }

  return <p className={`rich-text-content rich-text-content--plain ${className}`}>{trimmed}</p>;
}
