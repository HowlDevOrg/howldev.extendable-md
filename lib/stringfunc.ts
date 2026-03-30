export function separate(name: string): string[] {
  const splits = name.split('\n').map(a => a.trimEnd()).join('\n').split('\n\n');
  return splits;
}

export function combine(items: string[]): string[] {
  const newItems: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.startsWith('```')) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < items.length) {
        newItem.push(items[i]);
        if (!items[i].includes('`')) break;
        i++;
      }
      newItems.push(newItem.join('\n\n'))
    } else {
      newItems.push(item);
    }
  }

  return newItems;
}