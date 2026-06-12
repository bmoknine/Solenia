const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG_RE.test(value);
}

/** TipTap renvoie souvent `<p></p>` pour un document vide. */
export function normalizeRichTextOutput(html: string): string {
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (!text) return '';
  return html;
}

export function prepareEditorContent(value: string | null | undefined): string {
  if (!value?.trim()) return '';
  if (looksLikeHtml(value)) return value;
  const paragraphs = value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return '';
  if (paragraphs.length === 1) {
    return `<p>${escapePlainLine(paragraphs[0])}</p>`;
  }
  return paragraphs.map((p) => `<p>${escapePlainLine(p)}</p>`).join('');
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapePlainLine(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
