/**
 * Returns the localized string field from a data object.
 * Looks for `field_en` when locale is 'en'; falls back to `field`.
 */
export function lf(obj: unknown, field: string, locale: string): string {
  const record = obj as Record<string, unknown>;
  if (locale === "en") {
    const enVal = record[`${field}_en`];
    if (typeof enVal === "string") return enVal;
  }
  const val = record[field];
  return typeof val === "string" ? val : "";
}

/**
 * Returns the localized string array field from a data object.
 */
export function lfa(obj: unknown, field: string, locale: string): string[] {
  const record = obj as Record<string, unknown>;
  if (locale === "en") {
    const enVal = record[`${field}_en`];
    if (Array.isArray(enVal)) return enVal as string[];
  }
  const val = record[field];
  return Array.isArray(val) ? (val as string[]) : [];
}
