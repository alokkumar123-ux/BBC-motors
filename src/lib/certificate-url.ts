/** Certificate numbers contain "/", so URLs use "-" instead (BBC2026/1043 -> BBC2026-1043). */
export function certificateSlug(number: string): string {
  return number.replace("/", "-");
}
export function certificateNumberFromSlug(slug: string): string {
  return slug.toUpperCase().replace("-", "/");
}
