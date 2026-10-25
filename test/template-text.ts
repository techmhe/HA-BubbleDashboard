/** Flattens a lit TemplateResult into its markup and text, enough to assert on content in Node. */
export function templateText(v: unknown): string {
  if (v === null || v === undefined || typeof v === 'boolean' || typeof v === 'symbol' || typeof v === 'function') return '';
  if (Array.isArray(v)) return v.map(templateText).join('');
  if (typeof v === 'object') {
    const t = v as { strings?: readonly string[]; values?: unknown[]; _$litDirective$?: unknown };
    if (t.strings && t.values) return t.strings.reduce((acc, s, i) => acc + s + (i < t.values!.length ? templateText(t.values![i]) : ''), '');
    return '';
  }
  return String(v);
}

/** Visible text only (tags stripped, whitespace collapsed). */
export function visibleText(v: unknown): string {
  return templateText(v).replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
