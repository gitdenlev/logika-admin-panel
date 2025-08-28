/**
 * Повертає ініціали з повного імені.
 * @param name - Повне ім'я, наприклад "Іван Петренко".
 * @returns Ініціали, наприклад "ІП".
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length > 1) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return "";
}
