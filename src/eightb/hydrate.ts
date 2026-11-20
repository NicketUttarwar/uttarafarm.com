/** Fill `{{key}}` placeholders in an HTML template string. */
export function hydrateTemplate(
  template: string,
  copy: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = copy[key];
    if (value === undefined) return "";
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  });
}
