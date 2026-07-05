export function cx(
  ...values: Array<false | null | string | undefined>
): string {
  return values.filter(Boolean).join(' ');
}
