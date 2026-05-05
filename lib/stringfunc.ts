/**
 * Takes in a blob of text and parses with respect to code blocks,
 * block quotes, headers, horizontal lines, images, ol, and ul.
 * @param items The text to parse (split by \n)
 * @returns Split items according to semantics
 */
export function semanticDiffuser(items: string): string[] {
  const oldItems: string[] = items.split("\n").map((a) => a.trimEnd());
  const newItems: string[] = [];

  for (let i = 0; i < oldItems.length; i++) {
    const item = oldItems[i];
    if (item.startsWith("```")) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < oldItems.length && oldItems[i] !== "```") {
        // These 7 lines are black magic that I don't understand.
        newItem.push(oldItems[i]);
        i++;
      }
      if (i < oldItems.length && oldItems[i] === "```") {
        i++;
      }
      i--;
      newItems.push(newItem.join("\n"));
    } else if (item.startsWith("#")) {
      newItems.push(item);
    } else if (item.startsWith(">")) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < oldItems.length && oldItems[i].startsWith(">")) {
        // ditto
        newItem.push(oldItems[i]);
        i++;
      }
      if (i < oldItems.length && oldItems[i].startsWith(">")) {
        i++;
      }
      i--;
      newItems.push(newItem.join("\n"));
    } else if (item === "---") {
      newItems.push("---");
    } else if (item.match(/^[\-+\*]\s/g)) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < oldItems.length && oldItems[i].match(/[\-+\*]\s|\s+\d+./g)) {
        newItem.push(oldItems[i]);
        i++;
      }
      if (i < oldItems.length && oldItems[i].match(/[\-+\*]\s|\s+\d+./g)) {
        i++;
      }
      i--;
      newItems.push(newItem.join("\n"));
    } else if (item.match(/^\d+\.\s/g)) {
      const newItem: string[] = [];
      newItem.push(item);
      i++;
      while (i < oldItems.length && oldItems[i].match(/\d+\.\s|\s[\-+\*]\s/g)) {
        newItem.push(oldItems[i]);
        i++;
      }
      if (i < oldItems.length && oldItems[i].match(/\d+\.\s|\s[\-+\*]\s/g)) {
        i++;
      }
      i--;
      newItems.push(newItem.join("\n"));
    } else {
      newItems.push(item);
    }
  }

  return newItems;
}
