export function separate(name: string): string[] {
  const splits = name.split('\n').map(a => a.trim()).join('\n').split('\n\n');
  return splits;
}
