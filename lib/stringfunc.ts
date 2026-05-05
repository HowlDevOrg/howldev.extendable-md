/**
 * Takes in a blob of text and parses with respect to code blocks, 
 * block quotes, headers, horizontal lines, images, ol, and ul.
 * @param items The text to parse (split by \n)
 * @returns Split items according to semantics 
 */
export function semanticDiffuser(items: string): string[] {
  const oldItems: string[] = items.split('\n').map(a => a.trimEnd());
  const newItems: string[] = [];

  for (let i = 0; i < oldItems.length; i++) {
    const item = oldItems[i];
    if (item.startsWith('```')) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < oldItems.length && oldItems[i] !== '```') {
        newItem.push(oldItems[i]);
        i++;
      }
      if (i < oldItems.length && oldItems[i] === '```') {
        i++;
      }
      i--;
      newItems.push(newItem.join('\n'))
    } else if (item.startsWith('#')) {
      newItems.push(item);
    } else {
      newItems.push(item);
    }
  }

  return newItems;
}