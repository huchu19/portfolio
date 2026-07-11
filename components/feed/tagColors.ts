/* fragment tag → dot color (VISION Part 5: ember philosophy, wave tech, green football) */
const TAG_COLORS: Record<string, string> = {
  philosophy: 'var(--tag-philosophy)',
  religion: 'var(--tag-religion)',
  tech: 'var(--tag-tech)',
  football: 'var(--tag-football)',
  poetry: 'var(--tag-poetry)',
  comedy: 'var(--tag-comedy)',
  manga: 'var(--tag-manga)',
  music: 'var(--tag-music)',
}

export function fragmentDot(tags: string[]): string {
  for (const t of tags) if (TAG_COLORS[t]) return TAG_COLORS[t]
  return 'var(--dot-fragment)'
}
